package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.UpdateWorkoutNameDTO;
import com.example.keepitup.model.dtos.WorkoutsDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.WORKOUTS)
public interface WorkoutsApi {

    @PostMapping
    ResponseEntity<WorkoutsDTO> logWorkout(@RequestBody WorkoutsDTO workoutDTO);

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<List<WorkoutsDTO>> getWorkoutsByUserId(@PathVariable("id") Integer userId);

    @GetMapping(UriConstants.UNIQUEWORKOUTSBYID)
    ResponseEntity<List<String>> getUniqueWorkoutNames(@PathVariable Integer userId);

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteWorkout(@PathVariable("id") Integer userId);

    @PatchMapping(UriConstants.UPDATE_NAME)
    ResponseEntity<WorkoutsDTO> updateWorkoutName(@PathVariable Integer id, @RequestBody UpdateWorkoutNameDTO updateWorkoutNameDTO);

}
