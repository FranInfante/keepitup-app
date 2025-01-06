package com.example.MoreGains.model.dtos;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
    private List<WorkoutDTO> workouts;
}