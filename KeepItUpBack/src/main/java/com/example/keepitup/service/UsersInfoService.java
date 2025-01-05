package com.example.keepitup.service;


import com.example.keepitup.model.dtos.UsersInfoDTO;

public interface UsersInfoService {
    UsersInfoDTO saveUserInfo(UsersInfoDTO usersInfoDTO);
    UsersInfoDTO getUserInfoByUserId(Integer userId);
    void updateUserLanguage(Integer userId, String language);
    void updateUserTheme(Integer userId, String theme);

}