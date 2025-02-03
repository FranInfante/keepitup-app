package com.example.keepitup.model.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDTO {
    private Integer id;
    private String name;
    private Integer userId;
    private List<WorkoutsDTO> workouts;
}