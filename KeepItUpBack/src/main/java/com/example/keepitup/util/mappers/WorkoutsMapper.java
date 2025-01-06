package com.example.keepitup.util.mappers;


import com.example.keepitup.model.dtos.WorkoutsDTO;
import com.example.keepitup.model.entities.Workouts;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class WorkoutsMapper {

    public Workouts workoutsDTOToEntity(WorkoutsDTO workoutsDTO) {
        return Workouts.builder()
                .id(workoutsDTO.getId())
                .name(workoutsDTO.getName())
                .date(workoutsDTO.getDate())
                .build();
    }

    public WorkoutsDTO workoutsEntityToDTO(Workouts workouts) {
        return WorkoutsDTO.builder()
                .id(workouts.getId())
                .userId(workouts.getUser().getId())
                .name(workouts.getName())
                .date(workouts.getDate())
                .build();
    }

    public List<Workouts> listWorkoutsDTOToEntity(List<WorkoutsDTO> workoutsDTOList) {
        return workoutsDTOList.stream().map(WorkoutsMapper::workoutsDTOToEntity).collect(Collectors.toList());
    }

    public static List<WorkoutsDTO> listWorkoutEntityToDTO(List<Workouts> workouts) {
        return workouts.stream().map(WorkoutsMapper::workoutsEntityToDTO).collect(Collectors.toList());
    }
}