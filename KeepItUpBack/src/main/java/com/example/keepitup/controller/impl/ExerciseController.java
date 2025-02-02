package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.ExerciseApi;
import com.example.keepitup.model.dtos.ExerciseDTO;
import com.example.keepitup.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExerciseController implements ExerciseApi {

    private final ExerciseService exerciseService;

    @Override
    public ResponseEntity<List<ExerciseDTO>> getAllExercises(Integer userId) {
        List<ExerciseDTO> exercises = exerciseService.getAllExercises(userId);
        return ResponseEntity.ok(exercises);
    }

    @Override
    public ResponseEntity<ExerciseDTO> getExerciseById(Integer id) {
        ExerciseDTO exercise = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exercise);
    }

    @Override
    public ResponseEntity<ExerciseDTO> createExercise(ExerciseDTO newExercise) throws Exception {
        ExerciseDTO createdExercise = exerciseService.saveExercise(newExercise);
        return ResponseEntity.ok(createdExercise);
    }

    @Override
    public ResponseEntity<Void> deleteExerciseById(Integer id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> updateExercise(Integer id, ExerciseDTO updateExercise) throws Exception {
        exerciseService.saveExercise(updateExercise);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<ExerciseDTO> checkAndCreateExercise(ExerciseDTO exerciseDTO,  Integer planId, Integer workoutId) {
        ExerciseDTO createdExercise = exerciseService.checkAndCreateExercise(exerciseDTO, planId, workoutId);
        return ResponseEntity.ok(createdExercise);
    }
}