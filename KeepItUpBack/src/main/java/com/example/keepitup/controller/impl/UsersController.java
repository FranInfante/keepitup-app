package com.example.keepitup.controller.impl;



import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.keepitup.controller.UsersApi;
import com.example.keepitup.model.dtos.MailDTO;
import com.example.keepitup.model.dtos.PasswordResetDTO;
import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.model.dtos.VerificationDTO;
import com.example.keepitup.repository.PlanRepository;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.repository.WeighInsRepository;
import com.example.keepitup.repository.WorkoutLogRepository;
import com.example.keepitup.repository.WorkoutsRepository;
import com.example.keepitup.service.MailService;
import com.example.keepitup.service.UsersService;
import com.example.keepitup.util.UserJwt;
import com.example.keepitup.util.msgs.MessageConstants;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UsersController implements UsersApi {

    private final UsersService usersService;
    private final MailService mailService;

    private final UsersRepository usersRepository;
    private final PlanRepository planRepository;
    private final WeighInsRepository weighInsRepository;
    private final WorkoutsRepository workoutsRepository;
    private final WorkoutLogRepository workoutLogRepository;

//    @Override
//    public ResponseEntity<UsersDTO> getUserById(Integer id) {
//        UsersDTO user = usersService.getUserById(id);
//        return ResponseEntity.ok(user);
//    }

//    @Override
//    public ResponseEntity<List<UsersDTO>> getAllUsers() {
//        List<UsersDTO> users = usersService.getAllUsers();
//        return ResponseEntity.ok(users);
//    }

    @Override
    public ResponseEntity<List<UsersDTO>> searchUsers(String username) {
        List<UsersDTO> users = usersService.searchUsersByUsername(username);
        return ResponseEntity.ok(users);
    }

    @Override
    public ResponseEntity<UsersDTO> createUser(UsersDTO newUser) throws Exception {
        UsersDTO createdUser = usersService.createUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @Override
    public ResponseEntity<UsersDTO> loginUser(UsersDTO userDTO) {
        String identifier = userDTO.getEmail() != null ? userDTO.getEmail() : userDTO.getUsername();
        return usersService.loginUser(identifier, userDTO.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @Override
    @Transactional
    public ResponseEntity<Void> deleteUserById(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        UsersDTO currentUser = usersService.getUserByUsername(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        System.out.println(currentUser.getId());

        if (!currentUser.getId().equals(id)) {
            throw new AccessDeniedException("You are not authorized to delete this user.");
        }

        planRepository.deleteByUserId(id);
        weighInsRepository.deleteByUserId(id);
        workoutLogRepository.deleteByUserId(id);
        workoutsRepository.deleteByUserId(id);

        usersRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @Override
    public ResponseEntity<Void> updateUser(Integer id,UsersDTO updateUser) throws Exception {
        usersService.updateUser(id, updateUser);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<UserJwt> authUser(@RequestBody UsersDTO userDTO) throws Exception {
        UserJwt userJwt = usersService.createAuthenticationToken(userDTO);

        return ResponseEntity.ok(userJwt);
    }
    @Override
    public ResponseEntity<UsersDTO> getUserInfo() {
        UsersDTO usersDTO = usersService.getUserInformation().get();
        return ResponseEntity.ok(usersDTO);
    }

    @Override
    public ResponseEntity<Void> sendEmail(@RequestBody MailDTO mailDTO) {
        mailService.sendSimpleEmail(mailDTO.getTo(), mailDTO.getSubject(), mailDTO.getText());
        return ResponseEntity.ok().build();
    }
    @Override
    public ResponseEntity<String> registerUser(@RequestBody UsersDTO newUser) {
        if (usersService.isEmailOrUsernameRegistered(newUser.getEmail(), newUser.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(MessageConstants.USEROREMAILFOUND);
        }

        String verificationCode = usersService.generateVerificationCode();
        usersService.savePendingUser(newUser, verificationCode);
        mailService.sendSimpleEmail(
                newUser.getEmail(),
                "Email Verification Code",
                "Your verification code is: " + verificationCode
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @Override
    public ResponseEntity<UsersDTO> verifyCode(@RequestBody VerificationDTO verificationDTO) throws Exception {
        String email = verificationDTO.getEmail();
        String code = verificationDTO.getCode();

        if (usersService.verifyCode(email, code)) {
            UsersDTO user = usersService.createUserFromPending(email);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Override
    public ResponseEntity<Map<String, String>> requestPasswordReset(@RequestBody PasswordResetDTO resetDTO) {
        usersService.requestPasswordReset(resetDTO.getEmail());

        // Return a JSON response
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset email sent successfully.");
        return ResponseEntity.ok(response);
    }


    @Override
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetDTO resetDTO) {
        boolean success = usersService.resetPassword(resetDTO.getToken(), resetDTO.getNewPassword());
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "Password reset successful.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid token.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


}

