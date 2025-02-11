package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutLogSearchRequest {
    private Integer userId;
    private Integer workoutId;
    private Boolean isEditing;
}
