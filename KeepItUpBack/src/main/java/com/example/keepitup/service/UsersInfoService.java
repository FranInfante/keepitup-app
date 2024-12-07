package com.example.keepitup.service;


import com.example.keepitup.model.dtos.UsersInfoDTO;

public interface UsersInfoService {
    UsersInfoDTO saveUserInfo(UsersInfoDTO usersInfoDTO);
    UsersInfoDTO getUserInfoByUserId(Integer userId);
}