package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetUserLanguageRequestDTO {
    private Integer userId;
    private String language;
}
