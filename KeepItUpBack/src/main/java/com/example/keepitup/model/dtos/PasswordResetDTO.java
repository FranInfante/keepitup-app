package com.example.keepitup.model.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetDTO {
    private String email;
    private String token;
    private String newPassword;
}
