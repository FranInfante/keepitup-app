package com.example.keepitup.service.impl;


import com.example.keepitup.util.mappers.UsersInfoMapper;
import com.example.keepitup.model.dtos.UsersInfoDTO;
import com.example.keepitup.model.entities.UsersInfo;
import com.example.keepitup.repository.UsersInfoRepository;
import com.example.keepitup.service.UsersInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersInfoServiceImpl implements UsersInfoService {

    private UsersInfoRepository usersInfoRepository;

    @Override
    public UsersInfoDTO saveUserInfo(UsersInfoDTO usersInfoDTO) {
        UsersInfo usersInfo = UsersInfoMapper.usersInfoDTOToEntity(usersInfoDTO);
        UsersInfo savedUsersInfo = usersInfoRepository.save(usersInfo);
        return UsersInfoMapper.usersInfoEntityToDTO(savedUsersInfo);
    }

    @Override
    public UsersInfoDTO getUserInfoByUserId(Integer userId) {
        UsersInfo usersInfo = usersInfoRepository.findById(userId).orElseThrow(() -> new RuntimeException("User Info not found"));
        return UsersInfoMapper.usersInfoEntityToDTO(usersInfo);
    }
}