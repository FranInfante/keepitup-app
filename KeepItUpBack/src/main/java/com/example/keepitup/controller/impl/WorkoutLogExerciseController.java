package com.example.keepitup.controller.impl;



import com.example.keepitup.controller.WorkoutLogExerciseApi;
import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.service.WorkoutLogExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WorkoutLogExerciseController implements WorkoutLogExerciseApi {

    private final WorkoutLogExerciseService workoutLogExerciseService;

    @Override
    public ResponseEntity<List<WorkoutLogExerciseDTO>> getExercisesByWorkoutLogId(Integer workoutLogId) {
        List<WorkoutLogExerciseDTO> exercises = workoutLogExerciseService.findByWorkoutLogId(workoutLogId);
        return ResponseEntity.ok(exercises);
    }

    @Override
    public ResponseEntity<WorkoutLogExerciseDTO> createWorkoutLogExercise(WorkoutLogExerciseDTO workoutLogExerciseDTO) {
        WorkoutLogExerciseDTO createdExercise = workoutLogExerciseService.addWorkoutLogExercise(workoutLogExerciseDTO);
        return ResponseEntity.ok(createdExercise);
    }

    @Override
    public ResponseEntity<WorkoutLogExerciseDTO> updateWorkoutLogExercise(Integer id, WorkoutLogExerciseDTO workoutLogExerciseDTO) {
        WorkoutLogExerciseDTO updatedExercise = workoutLogExerciseService.updateWorkoutLogExercise(id, workoutLogExerciseDTO);
        return ResponseEntity.ok(updatedExercise);
    }

    @Override
    public ResponseEntity<Void> deleteWorkoutLogExercise(Integer workoutLogId, Integer exerciseId) {
        workoutLogExerciseService.deleteWorkoutLogExercise(workoutLogId, exerciseId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> deleteWorkoutLogSet(Integer workoutLogId, Integer exerciseId, Integer setNumber) {
        workoutLogExerciseService.deleteWorkoutLogSet(workoutLogId, exerciseId, setNumber);
        return ResponseEntity.noContent().build();
    }

}
