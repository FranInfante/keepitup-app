package com.example.keepitup.service.impl;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.keepitup.jwt.JwtUserDetailsService;
import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.model.entities.UsersInfo;
import com.example.keepitup.repository.UsersInfoRepository;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.service.MailService;
import com.example.keepitup.service.UsersService;
import com.example.keepitup.util.UserJwt;
import com.example.keepitup.util.jwt.JwtTokenUtil;
import com.example.keepitup.util.mappers.UsersMapper;
import com.example.keepitup.util.msgs.MessageConstants;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final JwtUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final UsersInfoRepository usersInfoRepository;
    private final MailService mailService;

    private final Map<String, PendingUser> pendingUsers = new HashMap<>();
    private final Map<String, String> resetTokens = new HashMap<>();

    @Value("${server-url}")
    private String serverUrl;

//    @Override
//    public List<UsersDTO> getAllUsers() {
//        List<Users> users = usersRepository.findAll();
//        return UsersMapper.listUserEntityToDTO(users);
//    }

//    @Override
//    public UsersDTO getUserById(Integer id) {
//        Users user = usersRepository.findById(id)
//                    .orElseThrow(() -> new EntityNotFoundException(MessageConstants.USER_NOT_FOUND));
//        return UsersMapper.userEntityToDTO(user);
//    }

    @Override
    public UsersDTO createUser(UsersDTO newUser) throws Exception {
        if (usersRepository.findByUsernameIgnoreCase(newUser.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (usersRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        Users user = UsersMapper.userDTOToEntity(newUser);
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        Users savedUser = usersRepository.save(user);

        UsersInfo usersInfo = UsersInfo.builder()
                .user(savedUser)
                .initialWeight(0.0)
                .goalWeight(0.0)
                .workoutDaysPerWeek(0)
                .language("en")
                .theme("dark")
                .build();

        usersInfoRepository.save(usersInfo);
        savedUser.setUsersInfo(usersInfo);

        return UsersMapper.userEntityToDTO(savedUser);
    }

    @Override
    public void deleteUserById(Integer id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.USER_NOT_FOUND));
        usersRepository.delete(user);
    }

    @Override
    public void updateUser(Integer userId, UsersDTO updateUser) throws Exception {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.USER_NOT_FOUND));

        if (updateUser.getUsername() != null) {
            user.setUsername(updateUser.getUsername());
        }
        if (updateUser.getEmail() != null) {
            user.setEmail(updateUser.getEmail());
        }
        if (updateUser.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updateUser.getPassword()));
        }

        usersRepository.save(user);
    }

    @Override
    public List<UsersDTO> searchUsersByUsername(String username) {
        List<Users> users = usersRepository.findUsersByUsernameIgnoreCase(username);
        return UsersMapper.listUserEntityToDTO(users);
    }

    @Override
    public Optional<UsersDTO> loginUser(String identifier, String password) {
        Optional<Users> user = usersRepository.findByEmail(identifier)
                .or(() -> usersRepository.findByUsernameIgnoreCase(identifier));

        return user.filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(UsersMapper::userEntityToDTO);
    }

    @Override
    public UserJwt createAuthenticationToken(UsersDTO authenticationRequest) throws Exception {
        String usernameOrEmail = authenticationRequest.getUsername() != null ? authenticationRequest.getUsername() : authenticationRequest.getEmail();
        authenticate(usernameOrEmail, authenticationRequest.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(usernameOrEmail);
        final String token = jwtTokenUtil.generateToken(userDetails);
        return UserJwt.builder().token(token).build();
    }



    private void authenticate(String usernameOrEmail, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(usernameOrEmail, password));
        } catch (DisabledException e) {
            throw new Exception(MessageConstants.USER_DISABLE, e);
        } catch (BadCredentialsException e) {
            throw new Exception(MessageConstants.INVALID_CREDENTIALS, e);
        }
    }

    @Override
    public Optional<UsersDTO> getUserInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return Optional.empty();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        Users user = usersRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.USER_NOT_FOUND));

        UsersDTO userDTO = UsersMapper.userEntityToDTO(user);
        userDTO.setPassword(user.getPassword());

        return Optional.of(userDTO);
    }

    @Override
    public String generateVerificationCode() {
        return String.valueOf((int) (Math.random() * 9000) + 1000); // 4-digit random code
    }

    @Override
    public void savePendingUser(UsersDTO newUser, String code) {
        PendingUser pendingUser = new PendingUser(newUser, code);
        pendingUsers.put(newUser.getEmail(), pendingUser);
    }

    @Override
    public boolean verifyCode(String email, String code) {
        PendingUser pendingUser = pendingUsers.get(email);
        return pendingUser != null && pendingUser.code().equals(code);
    }

    @Override
    public UsersDTO createUserFromPending(String email) throws Exception{
        PendingUser pendingUser = pendingUsers.remove(email);
        if (pendingUser != null) {
            return createUser(pendingUser.user());
        }
        throw new RuntimeException("No pending user found");
    }

        private record PendingUser(UsersDTO user, String code) {

    }

    @Override
    public boolean isEmailOrUsernameRegistered(String email, String username) {
        boolean emailExists = usersRepository.findByEmail(email).isPresent();
        boolean usernameExists = usersRepository.findByUsernameIgnoreCase(username).isPresent();
        return emailExists || usernameExists;
    }
    
    @Override
    public Optional<UsersDTO> getUserByUsername(String username) {
        return usersRepository.findByUsernameIgnoreCase(username)
                .map(UsersMapper::userEntityToDTO);
    }

        @Override
        public void requestPasswordReset(String email) {
            Optional<Users> userOpt = usersRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                throw new EntityNotFoundException("User not found");
            }

            // Generate token (UUID is a simple solution)
            String token = UUID.randomUUID().toString();
            resetTokens.put(token, email); // Store temporarily

            // Send email
            String resetLink = serverUrl + "/reset-password?token=" + token;
            mailService.sendSimpleEmail(email, "Password Reset Request",
                    "Click the link to reset your password: " + resetLink);
        }

        @Override
        public boolean resetPassword(String token, String newPassword) {
            String email = resetTokens.get(token);
            if (email == null) {
                throw new IllegalArgumentException("Invalid or expired token");
            }

            Users user = usersRepository.findByEmail(email)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            user.setPassword(passwordEncoder.encode(newPassword));
            usersRepository.save(user);

            resetTokens.remove(token); // Remove token after use
            return true;
        }



}
