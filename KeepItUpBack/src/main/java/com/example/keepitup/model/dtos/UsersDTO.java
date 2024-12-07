package com.example.keepitup.model.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersDTO {
    private Integer id;
    private String username;
    private String email;
    private String password;
    private UsersInfoDTO usersInfo;
}