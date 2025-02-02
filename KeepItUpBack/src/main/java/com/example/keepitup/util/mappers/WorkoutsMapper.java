package com.example.keepitup.util.mappers;


import com.example.keepitup.model.dtos.WorkoutsDTO;
import com.example.keepitup.model.entities.Workouts;
import lombok.experimental.UtilityClass;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.keepitup.util.msgs.MessageConstants.NULL_WORKOUT_NAME;

@UtilityClass
public class WorkoutsMapper {

    public Workouts workoutsDTOToEntity(WorkoutsDTO workoutsDTO) {
        if (workoutsDTO == null) {
            return null;
        }

        Workouts workout = new Workouts();
        if (workoutsDTO.getId() != null) {
            workout.setId(workoutsDTO.getId());
        }
        workout.setDate(workoutsDTO.getDate());

        if (workoutsDTO.getName() == null || workoutsDTO.getName().isEmpty()) {
            throw new IllegalArgumentException(NULL_WORKOUT_NAME);
        }
        workout.setName(workoutsDTO.getName());

        if (workoutsDTO.getDescription() != null) {
            workout.setDescription(workoutsDTO.getDescription());
        }
        if (workoutsDTO.getWorkoutExercises() != null) {
            workout.setWorkoutExercises(WorkoutExerciseMapper.listWorkoutExerciseDTOToEntity(workoutsDTO.getWorkoutExercises()));
        }if (workoutsDTO.getSort() != null) {
            workout.setSort(workoutsDTO.getSort());
        } else {
            workout.setWorkoutExercises(new ArrayList<>());
        }
        return workout;
    }

    public WorkoutsDTO workoutsEntityToDTO(Workouts workouts) {
        return WorkoutsDTO.builder()
                .id(workouts.getId())
                .userId(workouts.getUser().getId())
                .name(workouts.getName())
                .date(workouts.getDate())
                .workoutExercises(WorkoutExerciseMapper.listWorkoutExerciseEntityToDTO(workouts.getWorkoutExercises()))
                .build();
    }

    public List<Workouts> listWorkoutsDTOToEntity(List<WorkoutsDTO> workoutsDTOList) {
        return workoutsDTOList.stream().map(WorkoutsMapper::workoutsDTOToEntity).collect(Collectors.toList());
    }

    public static List<WorkoutsDTO> listWorkoutEntityToDTO(List<Workouts> workouts) {
        return workouts.stream().map(WorkoutsMapper::workoutsEntityToDTO).collect(Collectors.toList());
    }
}