package com.example.keepitup.model.dtos;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutLogExerciseDTO {
    private Integer id;
    private Integer exerciseId;
    private String exerciseName;
    private List<SetDTO> sets;
    private Integer workoutLogId;
    private String notes;
    private Integer exerciseOrder;

}
