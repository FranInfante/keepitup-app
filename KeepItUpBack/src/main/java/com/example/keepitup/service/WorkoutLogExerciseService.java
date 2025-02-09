package com.example.keepitup.service;


import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;

import java.util.List;

public interface WorkoutLogExerciseService {

    List<WorkoutLogExerciseDTO> findByWorkoutLogId(Integer workoutLogId);

    WorkoutLogExerciseDTO addWorkoutLogExercise(WorkoutLogExerciseDTO workoutLogExerciseDTO);

    WorkoutLogExerciseDTO updateWorkoutLogExercise(Integer id, WorkoutLogExerciseDTO workoutLogExerciseDTO);

    void deleteWorkoutLogExercise(Integer workoutLogId, Integer exerciseId);

    void deleteWorkoutLogSet(Integer workoutLogId, Integer exerciseId, Integer setNumber);

}
