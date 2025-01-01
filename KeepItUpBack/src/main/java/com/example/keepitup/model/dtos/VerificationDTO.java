package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationDTO {
    private String email;
    private String code;
}
