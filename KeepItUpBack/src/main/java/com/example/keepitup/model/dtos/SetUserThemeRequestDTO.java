package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetUserThemeRequestDTO {
    private Integer userId;
    private String theme;
}
