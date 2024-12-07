package com.example.keepitup.service.impl;


import com.example.keepitup.jwt.JwtUserDetailsService;
import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.service.UsersService;
import com.example.keepitup.util.UserJwt;
import com.example.keepitup.util.jwt.JwtTokenUtil;
import com.example.keepitup.util.mappers.UsersMapper;
import com.example.keepitup.util.msgs.MessageConstants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final JwtUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsersDTO> getAllUsers() {
        List<Users> users = usersRepository.findAll();
        return UsersMapper.listUserEntityToDTO(users);
    }

    @Override
    public UsersDTO getUserById(Integer id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.USER_NOT_FOUND));
        return UsersMapper.userEntityToDTO(user);
    }

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
}
