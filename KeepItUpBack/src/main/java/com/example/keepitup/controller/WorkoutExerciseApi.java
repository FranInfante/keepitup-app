package com.example.MoreGains.controller;

import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.MoreGains.util.UriConstants;

import java.util.List;

@RequestMapping(UriConstants.WORKOUT_EXERCISES)
public interface WorkoutExerciseApi {

    @GetMapping
    ResponseEntity<List<WorkoutExerciseDTO>> getAllWorkoutExercises();

    @GetMapping(UriConstants.WORKOUT_EXERCISES_FOR_WORKOUT)
    ResponseEntity<List<WorkoutExerciseDTO>> getExercisesForWorkout(@PathVariable Integer workoutId);

    @PostMapping
    ResponseEntity<WorkoutExerciseDTO> createWorkoutExercise(@RequestBody WorkoutExerciseDTO newWorkoutExercise) throws Exception;

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteWorkoutExerciseById(@PathVariable Integer id);

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<Void> updateWorkoutExercise(@PathVariable Integer id, @RequestBody WorkoutExerciseDTO updateWorkoutExercise) throws Exception;
}
