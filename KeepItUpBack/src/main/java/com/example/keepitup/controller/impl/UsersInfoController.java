package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.UsersInfoApi;
import com.example.keepitup.model.dtos.SetUserLanguageRequestDTO;
import com.example.keepitup.model.dtos.SetUserThemeRequestDTO;
import com.example.keepitup.model.dtos.UsersInfoDTO;
import com.example.keepitup.service.UsersInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class UsersInfoController implements UsersInfoApi {

    private final UsersInfoService usersInfoService;

    @Override
    public ResponseEntity<UsersInfoDTO> saveUserInfo(UsersInfoDTO usersInfoDTO) {
        UsersInfoDTO savedUserInfo = usersInfoService.saveUserInfo(usersInfoDTO);
        return ResponseEntity.status(201).body(savedUserInfo);
    }

    @Override
    public ResponseEntity<UsersInfoDTO> getUserInfoByUserId(Integer userId) {
        UsersInfoDTO userInfo = usersInfoService.getUserInfoByUserId(userId);
        return ResponseEntity.ok(userInfo);
    }

    @Override
    public ResponseEntity<Void> setUserLanguage(SetUserLanguageRequestDTO requestDTO) {
        usersInfoService.updateUserLanguage(requestDTO.getUserId(), requestDTO.getLanguage());
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> setUserTheme(SetUserThemeRequestDTO requestDTO) {
        usersInfoService.updateUserTheme(requestDTO.getUserId(), requestDTO.getTheme());
        return ResponseEntity.noContent().build();
    }
}
