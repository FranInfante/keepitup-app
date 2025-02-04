package com.example.keepitup.service;

import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.util.UserJwt;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

public interface UsersService {
//    UsersDTO getUserById(Integer id);

//    List<UsersDTO> getAllUsers();

    List<UsersDTO> searchUsersByUsername(String username);

    UsersDTO createUser(UsersDTO newUser) throws Exception;

    Optional<UsersDTO> loginUser(String identifier, String password);

    void deleteUserById(Integer id);

    void updateUser(Integer id, UsersDTO updateUser) throws Exception;

    UserJwt createAuthenticationToken(@RequestBody UsersDTO authenticationRequest) throws Exception;

    Optional<UsersDTO> getUserInformation();

    String generateVerificationCode();

    void savePendingUser(UsersDTO newUser, String code);

    boolean verifyCode(String email, String code);

    UsersDTO createUserFromPending(String email)  throws Exception;

    boolean isEmailOrUsernameRegistered(String email, String username);

    Optional<UsersDTO> getUserByUsername(String username);

}
