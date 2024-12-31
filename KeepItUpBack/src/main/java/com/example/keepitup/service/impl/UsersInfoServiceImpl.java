package com.example.keepitup.service.impl;


import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.util.mappers.UsersInfoMapper;
import com.example.keepitup.model.dtos.UsersInfoDTO;
import com.example.keepitup.model.entities.UsersInfo;
import com.example.keepitup.repository.UsersInfoRepository;
import com.example.keepitup.service.UsersInfoService;
import com.example.keepitup.util.msgs.MessageConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersInfoServiceImpl implements UsersInfoService {

    private final UsersInfoRepository usersInfoRepository;
    private final UsersRepository usersRepository;


    @Override
    public UsersInfoDTO saveUserInfo(UsersInfoDTO usersInfoDTO) {
        UsersInfo usersInfo = UsersInfoMapper.usersInfoDTOToEntity(usersInfoDTO);
        UsersInfo savedUsersInfo = usersInfoRepository.save(usersInfo);
        return UsersInfoMapper.usersInfoEntityToDTO(savedUsersInfo);
    }

    @Override
    public UsersInfoDTO getUserInfoByUserId(Integer userId) {
        UsersInfo usersInfo = usersInfoRepository.findById(userId).orElseThrow(() -> new RuntimeException(MessageConstants.USER_NOT_FOUND));
        return UsersInfoMapper.usersInfoEntityToDTO(usersInfo);
    }

    @Override
    public void updateUserLanguage(Integer userId, String language) {
        UsersInfo usersInfo = usersInfoRepository.findByUserId(userId).orElse(null);

        if (usersInfo == null) {
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException(MessageConstants.USER_NOT_FOUND));

            usersInfo = UsersInfo.builder()
                    .user(user)
                    .initialWeight(0.0)
                    .goalWeight(0.0)
                    .workoutDaysPerWeek(3)
                    .language(language)
                    .build();

            usersInfoRepository.save(usersInfo);
        } else {
            usersInfo.setLanguage(language);
            usersInfoRepository.save(usersInfo);
        }
    }

}