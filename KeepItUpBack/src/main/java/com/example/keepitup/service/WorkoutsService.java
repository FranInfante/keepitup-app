package com.example.keepitup.service;

import com.example.keepitup.model.dtos.WorkoutsDTO;

import java.util.List;

public interface WorkoutsService {
    WorkoutsDTO logWorkout(WorkoutsDTO workoutDTO);
    List<WorkoutsDTO> getWorkoutsByUserId(Integer userId);
    List<String> getDistinctWorkoutNamesByUserId(Integer userId);
    void deleteWeighIn(Integer weighInId);
    WorkoutsDTO updateWorkoutName(Integer id, String name) throws Exception;
}
