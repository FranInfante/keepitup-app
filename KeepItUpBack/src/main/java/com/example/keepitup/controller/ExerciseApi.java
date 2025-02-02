package com.example.keepitup.controller;


import com.example.keepitup.model.dtos.ExerciseDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.EXERCISES)
public interface ExerciseApi {

    @GetMapping
    ResponseEntity<List<ExerciseDTO>> getAllExercises(@RequestParam Integer userId);

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<ExerciseDTO> getExerciseById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<ExerciseDTO> createExercise(@RequestBody ExerciseDTO newExercise) throws Exception;

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteExerciseById(@PathVariable Integer id);

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<Void> updateExercise(@PathVariable Integer id, @RequestBody ExerciseDTO updateExercise) throws Exception;

    @PostMapping(UriConstants.EXERCISES_CREATE)
    ResponseEntity<ExerciseDTO> checkAndCreateExercise(@RequestBody ExerciseDTO exerciseDTO,
                                                              @RequestParam Integer planId,
                                                              @RequestParam Integer workoutId);
}