package com.example.MoreGains.service;

import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;

import java.util.List;

public interface WorkoutExerciseService {
    List<WorkoutExerciseDTO> getAllWorkoutExercises();
    List<WorkoutExerciseDTO> getExercisesForWorkout(Integer workoutId);
    WorkoutExerciseDTO saveWorkoutExercise(WorkoutExerciseDTO workoutExerciseDTO);
    void deleteWorkoutExercise(Integer id);
}