package com.example.keepitup.model.dtos;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutLogDTO {
    private Integer id;
    private Integer userId;
    private Integer workoutId;
    private String workoutName;
    private LocalDateTime date;
    private List<WorkoutLogExerciseDTO> exercises;
    private boolean isEditing;
}
