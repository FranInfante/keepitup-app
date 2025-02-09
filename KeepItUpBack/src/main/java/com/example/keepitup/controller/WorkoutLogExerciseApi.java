package com.example.keepitup.controller;


import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.WORKOUT_LOG_EXERCISES)
public interface WorkoutLogExerciseApi {

    @GetMapping(UriConstants.BY_WORKOUT_LOG_ID)
    ResponseEntity<List<WorkoutLogExerciseDTO>> getExercisesByWorkoutLogId(@PathVariable Integer workoutLogId);

    @PostMapping
    ResponseEntity<WorkoutLogExerciseDTO> createWorkoutLogExercise(@RequestBody WorkoutLogExerciseDTO workoutLogExerciseDTO);

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<WorkoutLogExerciseDTO> updateWorkoutLogExercise(@PathVariable Integer id, @RequestBody WorkoutLogExerciseDTO workoutLogExerciseDTO);

    @DeleteMapping(UriConstants.BY_WORKOUT_LOG_ID_AND_EXERCISE_ID)
    ResponseEntity<Void> deleteWorkoutLogExercise(
            @PathVariable Integer workoutLogId,
            @PathVariable Integer exerciseId
    );

    @DeleteMapping(UriConstants.BY_WORKOUT_LOG_ID_EXERCISE_ID_AND_SET_NUMBER)
    ResponseEntity<Void> deleteWorkoutLogSet(@PathVariable Integer workoutLogId, @PathVariable Integer exerciseId, @PathVariable Integer setNumber);

}
