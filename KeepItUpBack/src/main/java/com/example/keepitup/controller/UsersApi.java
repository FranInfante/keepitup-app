package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.util.UriConstants;
import com.example.keepitup.util.UserJwt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.USERS)
public interface UsersApi {

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<UsersDTO> getUserById(@PathVariable Integer id);

    @GetMapping
    ResponseEntity<List<UsersDTO>> getAllUsers();

    @GetMapping(UriConstants.USERS_SEARCH)
    ResponseEntity<List<UsersDTO>> searchUsers(@RequestParam String username);

    @PostMapping
    ResponseEntity<UsersDTO> createUser(@RequestBody UsersDTO newUser) throws Exception;

    @PostMapping(UriConstants.USERS_LOGIN)
    ResponseEntity<UsersDTO> loginUser(@RequestBody UsersDTO userDTO);

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteUserById(@PathVariable Integer id);

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<Void> updateUser(@PathVariable Integer id, @RequestBody UsersDTO updateUser) throws Exception;

    @PostMapping(UriConstants.USERS_AUTH)
    ResponseEntity<UserJwt> authUser(@RequestBody UsersDTO userDTO) throws Exception;

    @GetMapping(UriConstants.USERS_INFO)
    ResponseEntity<UsersDTO> getUserInfo() throws Exception;

}
