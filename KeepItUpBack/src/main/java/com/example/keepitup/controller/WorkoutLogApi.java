package com.example.keepitup.controller;



import com.example.keepitup.model.dtos.ExerciseDTO;
import com.example.keepitup.model.dtos.WorkoutLogDTO;
import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.model.dtos.WorkoutLogSearchRequest;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.WORKOUT_LOG)
public interface WorkoutLogApi {

    @GetMapping
    ResponseEntity<List<WorkoutLogDTO>> getAllWorkoutLogs();

    @GetMapping(UriConstants.BY_USER_ID)
    ResponseEntity<List<WorkoutLogDTO>> getWorkoutLogsByUserId(@PathVariable Integer userId);

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<WorkoutLogDTO> getWorkoutLogById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<WorkoutLogDTO> createWorkoutLog(@RequestBody WorkoutLogDTO workoutLogDTO);

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteWorkoutLog(@PathVariable Integer id);

    @PostMapping(UriConstants.FIND_BY_USER_AND_ISEDITING)
    ResponseEntity<WorkoutLogDTO> getWorkoutLogByUserIdAndIsEditing(@RequestBody WorkoutLogSearchRequest request);

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<WorkoutLogDTO> updateWorkoutLog(@PathVariable Integer id, @RequestBody WorkoutLogDTO workoutLogDTO);

    @GetMapping(UriConstants.EXERCISE_BY_ID)
    ResponseEntity<ExerciseDTO> getExerciseById(@PathVariable Integer exerciseId);

    @PatchMapping(UriConstants.REORDERWORKOUTLOGEXERCISES)
    ResponseEntity<Void> reorderExercises(
            @PathVariable Integer workoutLogId,
            @RequestBody List<WorkoutLogExerciseDTO> exercises);

    @GetMapping(UriConstants.LAST_COMPLETED)
    ResponseEntity<WorkoutLogDTO> getLastCompletedWorkoutLog(@PathVariable Integer userId, @PathVariable Integer workoutId);


}
