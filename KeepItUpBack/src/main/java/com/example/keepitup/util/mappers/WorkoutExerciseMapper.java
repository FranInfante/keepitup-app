package com.example.keepitup.util.mappers;

import com.example.keepitup.model.dtos.WorkoutExerciseDTO;
import com.example.keepitup.model.entities.WorkoutExercise;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class WorkoutExerciseMapper {

    public static WorkoutExerciseDTO workoutExerciseEntityToDTO(WorkoutExercise workoutExercise) {
        if (workoutExercise == null) {
            return null;
        }

        return WorkoutExerciseDTO.builder()
                .id(workoutExercise.getId())
                .exerciseId(workoutExercise.getExercise().getId())
                .exerciseName(workoutExercise.getExercise().getName())
                .exerciseOrder(workoutExercise.getExerciseOrder())
                .build();
    }

    public static WorkoutExercise workoutExerciseDTOToEntity(WorkoutExerciseDTO workoutExerciseDTO) {
        if (workoutExerciseDTO == null) {
            return null;
        }

        WorkoutExercise workoutExercise = new WorkoutExercise();
        workoutExercise.setId(workoutExerciseDTO.getId());
        workoutExercise.setExerciseOrder(workoutExerciseDTO.getExerciseOrder());

        return workoutExercise;
    }

    public static List<WorkoutExerciseDTO> listWorkoutExerciseEntityToDTO(List<WorkoutExercise> workoutExercises) {
        return workoutExercises.stream().map(WorkoutExerciseMapper::workoutExerciseEntityToDTO).collect(Collectors.toList());
    }

    public static List<WorkoutExercise> listWorkoutExerciseDTOToEntity(List<WorkoutExerciseDTO> workoutExerciseDTOs) {
        return workoutExerciseDTOs.stream().map(WorkoutExerciseMapper::workoutExerciseDTOToEntity).collect(Collectors.toList());
    }
}
