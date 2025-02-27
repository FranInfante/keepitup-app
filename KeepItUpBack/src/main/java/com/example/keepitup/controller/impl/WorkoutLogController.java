package com.example.keepitup.controller.impl;



import com.example.keepitup.controller.WorkoutLogApi;
import com.example.keepitup.model.dtos.ExerciseDTO;
import com.example.keepitup.model.dtos.WorkoutLogDTO;
import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.model.dtos.WorkoutLogSearchRequest;
import com.example.keepitup.service.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WorkoutLogController implements WorkoutLogApi {

    private final WorkoutLogService workoutLogService;

    @Override
    public ResponseEntity<List<WorkoutLogDTO>> getAllWorkoutLogs() {
        List<WorkoutLogDTO> workoutLogs = workoutLogService.getAllWorkoutLogs(); // Ensure this method is defined in service
        return ResponseEntity.ok(workoutLogs);
    }

    @Override
    public ResponseEntity<List<WorkoutLogDTO>> getWorkoutLogsByUserId(Integer userId) {
        List<WorkoutLogDTO> workoutLogs = workoutLogService.getWorkoutLogsForUser(userId);
        return ResponseEntity.ok(workoutLogs);
    }

    @Override
    public ResponseEntity<WorkoutLogDTO> getWorkoutLogById(Integer id) {
        WorkoutLogDTO workoutLog = workoutLogService.getWorkoutLogById(id); // Ensure this method is implemented
        return ResponseEntity.ok(workoutLog);
    }

    @Override
    public ResponseEntity<WorkoutLogDTO> createWorkoutLog(WorkoutLogDTO workoutLogDTO) {
        WorkoutLogDTO createdWorkoutLog = workoutLogService.createWorkoutLog(workoutLogDTO);
        return ResponseEntity.ok(createdWorkoutLog);
    }

    @Override
    public ResponseEntity<Void> deleteWorkoutLog(Integer id) {
        workoutLogService.deleteWorkoutLog(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<WorkoutLogDTO> getWorkoutLogByUserIdAndIsEditing(WorkoutLogSearchRequest request) {
        WorkoutLogDTO workoutLogDTO = workoutLogService.getWorkoutLogByUserIdAndIsEditing(
                request.getUserId(), request.getWorkoutId(), request.getIsEditing(), request.getGymId()
        );
        if (workoutLogDTO == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(workoutLogDTO);
    }




    @Override
    public ResponseEntity<WorkoutLogDTO> updateWorkoutLog(Integer id, WorkoutLogDTO workoutLogDTO) {
        WorkoutLogDTO updatedWorkoutLog = workoutLogService.updateWorkoutLog(id, workoutLogDTO);
        return ResponseEntity.ok(updatedWorkoutLog);
    }

    @Override
    public ResponseEntity<ExerciseDTO> getExerciseById(Integer exerciseId) {
        ExerciseDTO exerciseDTO = workoutLogService.getExerciseById(exerciseId);
        return ResponseEntity.ok(exerciseDTO);
    }

    @Override
    public ResponseEntity<Void> reorderExercises(Integer workoutLogId, List<WorkoutLogExerciseDTO> exercises) {
        workoutLogService.reorderExercises(workoutLogId, exercises);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<WorkoutLogDTO> getLastCompletedWorkoutLog(Integer userId, Integer workoutId, Integer gymId) {
        WorkoutLogDTO workoutLogDTO = workoutLogService.getLastCompletedWorkoutLog(userId, workoutId, gymId);
        return ResponseEntity.ok(workoutLogDTO);
    }

    @Override
    public ResponseEntity<Void> updateGymId(Integer id, Integer gymId) {
        workoutLogService.updateGymId(id, gymId);
        return ResponseEntity.noContent().build();
    }

}
