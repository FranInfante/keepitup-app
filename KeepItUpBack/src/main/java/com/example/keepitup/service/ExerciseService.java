package com.example.keepitup.service;

import com.example.keepitup.model.dtos.ExerciseDTO;

import java.util.List;

public interface ExerciseService {
    List<ExerciseDTO> getAllExercises(Integer userId);
    ExerciseDTO getExerciseById(Integer id);
    ExerciseDTO saveExercise(ExerciseDTO exerciseDTO);
    void deleteExercise(Integer id);
    ExerciseDTO checkAndCreateExercise(ExerciseDTO exerciseDTO, Integer planId, Integer workoutId);
}
