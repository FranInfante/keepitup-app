package com.example.keepitup.util.mappers;


import com.example.keepitup.model.dtos.UsersDTO;
import com.example.keepitup.model.entities.Users;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class UsersMapper {

    public Users userDTOToEntity(UsersDTO usersDTO) {
        if (usersDTO == null) {
            return null;
        }

        Users.UsersBuilder userBuilder = Users.builder()
                .id(usersDTO.getId())
                .username(usersDTO.getUsername())
                .email(usersDTO.getEmail())
                .password(usersDTO.getPassword());

        // Map UserInfoDTO to UserInfo and set the relationship
        if (usersDTO.getUsersInfo() != null) {
            userBuilder.usersInfo(UsersInfoMapper.usersInfoDTOToEntity(usersDTO.getUsersInfo()));
        }

        Users user = userBuilder.build();

        // Ensure the relationship is bidirectional
        if (user.getUsersInfo() != null) {
            user.getUsersInfo().setUser(user);
        }

        return user;
    }

    public UsersDTO userEntityToDTO(Users users) {
        if (users == null) {
            return null;
        }

        return UsersDTO.builder()
                .id(users.getId())
                .username(users.getUsername())
                .email(users.getEmail())
                .password(users.getPassword())
                .usersInfo(UsersInfoMapper.usersInfoEntityToDTO(users.getUsersInfo()))
                .build();
    }
    public List<Users> listUserDTOToEntity(List<UsersDTO> listUsersDto) {
        return listUsersDto.stream().map(UsersMapper::userDTOToEntity).collect(Collectors.toList());
    }

    public List<UsersDTO> listUserEntityToDTO(List<Users> listUsers) {
        return listUsers.stream().map(UsersMapper::userEntityToDTO).collect(Collectors.toList());
    }
}