package com.example.keepitup.util.mappers;


import com.example.keepitup.model.dtos.UsersInfoDTO;
import com.example.keepitup.model.entities.UsersInfo;
import com.example.keepitup.model.entities.Users;
import lombok.experimental.UtilityClass;

@UtilityClass
public class UsersInfoMapper {

    public UsersInfo usersInfoDTOToEntity(UsersInfoDTO usersInfoDTO) {
        if (usersInfoDTO == null) {
            return null;
        }

        UsersInfo.UsersInfoBuilder userInfoBuilder = UsersInfo.builder()
                .id(usersInfoDTO.getId())
                .initialWeight(usersInfoDTO.getInitialWeight())
                .goalWeight(usersInfoDTO.getGoalWeight())
                .workoutDaysPerWeek(usersInfoDTO.getWorkoutDaysPerWeek())
                .language(usersInfoDTO.getLanguage())
                .theme(usersInfoDTO.getTheme());

        // Set the user reference if the userId is present
        if (usersInfoDTO.getUserId() != null) {
            Users user = Users.builder().id(usersInfoDTO.getUserId()).build();
            userInfoBuilder.user(user);
        }

        return userInfoBuilder.build();
    }

    public UsersInfoDTO usersInfoEntityToDTO(UsersInfo usersInfo) {
        if (usersInfo == null) {
            return null;
        }

        return UsersInfoDTO.builder()
                .id(usersInfo.getId())
                .initialWeight(usersInfo.getInitialWeight())
                .goalWeight(usersInfo.getGoalWeight())
                .workoutDaysPerWeek(usersInfo.getWorkoutDaysPerWeek())
                .userId(usersInfo.getUser() != null ? usersInfo.getUser().getId() : null)
                .language(usersInfo.getLanguage())
                .theme(usersInfo.getTheme())
                .build();
    }
}