package com.example.keepitup.controller.impl;



import com.example.keepitup.controller.UsersApi;
import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.service.UsersService;
import com.example.keepitup.util.UserJwt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UsersController implements UsersApi {

    private final UsersService usersService;

    @Override
    public ResponseEntity<UsersDTO> getUserById(Integer id) {
        UsersDTO user = usersService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<List<UsersDTO>> getAllUsers() {
        List<UsersDTO> users = usersService.getAllUsers();
        return ResponseEntity.ok(users);
    }

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
    public ResponseEntity<Void> deleteUserById(Integer id) {
        usersService.deleteUserById(id);
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


}

