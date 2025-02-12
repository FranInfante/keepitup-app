package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymDTO {
    private Integer id;
    private Integer userId;
    private String name;
}
