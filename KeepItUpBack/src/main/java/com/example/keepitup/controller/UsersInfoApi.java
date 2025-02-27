package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.SetUserLanguageRequestDTO;
import com.example.keepitup.model.dtos.SetUserThemeRequestDTO;
import com.example.keepitup.model.dtos.UsersInfoDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping(UriConstants.INFO)
public interface UsersInfoApi {

    @PostMapping
    ResponseEntity<UsersInfoDTO> saveUserInfo(@RequestBody UsersInfoDTO usersInfoDTO);

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<UsersInfoDTO> getUserInfoByUserId(@PathVariable("id") Integer userId);

    @PatchMapping(UriConstants.SETLANGUAGEBYID)
    ResponseEntity<Void> setUserLanguage(@RequestBody SetUserLanguageRequestDTO requestDTO);

    @PatchMapping(UriConstants.SETTHEMEBYID)
    ResponseEntity<Void> setUserTheme(@RequestBody SetUserThemeRequestDTO requestDTO);

}
