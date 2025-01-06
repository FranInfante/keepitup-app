package com.example.MoreGains.util.mappers;

import com.example.MoreGains.model.dtos.PlanDTO;
import com.example.MoreGains.model.entities.Plan;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class PlanMapper {

    public static PlanDTO planEntityToDTO(Plan plan) {
        if (plan == null) {
            return null;
        }

        return PlanDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .userId(plan.getUser().getId())
                .workouts(WorkoutMapper.listWorkoutEntityToDTO(plan.getWorkouts()))
                .build();
    }

    public static Plan planDTOToEntity(PlanDTO planDTO) {
        if (planDTO == null) {
            return null;
        }

        Plan plan = new Plan();
        plan.setId(planDTO.getId());
        plan.setName(planDTO.getName());
        plan.setWorkouts(planDTO.getWorkouts().stream()
                .map(WorkoutMapper::workoutDTOToEntity)
                .collect(Collectors.toList()));

        return plan;
    }

    public static List<PlanDTO> listPlanEntityToDTO(List<Plan> plans) {
        return plans.stream().map(PlanMapper::planEntityToDTO).collect(Collectors.toList());
    }

    public static List<Plan> listPlanDTOToEntity(List<PlanDTO> planDTOs) {
        return planDTOs.stream().map(PlanMapper::planDTOToEntity).collect(Collectors.toList());
    }
}
