package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.WorkoutsApi;
import com.example.keepitup.model.dtos.WorkoutsDTO;
import com.example.keepitup.service.WorkoutsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WorkoutsController implements WorkoutsApi {

    private final WorkoutsService workoutsService;

    @Override
    public ResponseEntity<WorkoutsDTO> logWorkout(WorkoutsDTO workoutDTO) {
        WorkoutsDTO loggedWorkout = workoutsService.logWorkout(workoutDTO);
        return ResponseEntity.status(201).body(loggedWorkout);
    }

    @Override
    public ResponseEntity<List<WorkoutsDTO>> getWorkoutsByUserId(Integer userId) {
        List<WorkoutsDTO> workouts = workoutsService.getWorkoutsByUserId(userId);
        return ResponseEntity.ok(workouts);
    }

    @Override
    public ResponseEntity<List<String>> getUniqueWorkoutNames(Integer userId) {
        List<String> uniqueNames = workoutsService.getDistinctWorkoutNamesByUserId(userId);
        return ResponseEntity.ok(uniqueNames);
    }

    @Override
    public ResponseEntity<Void> deleteWorkout(Integer id) {
        workoutsService.deleteWeighIn(id);
        return ResponseEntity.ok().build();
    }
}
