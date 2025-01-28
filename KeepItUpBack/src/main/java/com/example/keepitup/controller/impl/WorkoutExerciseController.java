package com.example.MoreGains.controller.impl;

import com.example.MoreGains.controller.WorkoutExerciseApi;
import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;
import com.example.MoreGains.service.WorkoutExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WorkoutExerciseController implements WorkoutExerciseApi {

    private final WorkoutExerciseService workoutExerciseService;

    @Override
    public ResponseEntity<List<WorkoutExerciseDTO>> getAllWorkoutExercises() {
        List<WorkoutExerciseDTO> workoutExercises = workoutExerciseService.getAllWorkoutExercises();
        return ResponseEntity.ok(workoutExercises);
    }

    @Override
    public ResponseEntity<List<WorkoutExerciseDTO>> getExercisesForWorkout(Integer workoutId) {
        List<WorkoutExerciseDTO> exercises = workoutExerciseService.getExercisesForWorkout(workoutId);
        return ResponseEntity.ok(exercises);
    }

    @Override
    public ResponseEntity<WorkoutExerciseDTO> createWorkoutExercise(WorkoutExerciseDTO newWorkoutExercise) throws Exception {
        WorkoutExerciseDTO createdWorkoutExercise = workoutExerciseService.saveWorkoutExercise(newWorkoutExercise);
        return ResponseEntity.ok(createdWorkoutExercise);
    }

    @Override
    public ResponseEntity<Void> deleteWorkoutExerciseById(Integer id) {
        workoutExerciseService.deleteWorkoutExercise(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> updateWorkoutExercise(Integer id, WorkoutExerciseDTO updateWorkoutExercise) throws Exception {
        workoutExerciseService.saveWorkoutExercise(updateWorkoutExercise);
        return ResponseEntity.noContent().build();
    }
}