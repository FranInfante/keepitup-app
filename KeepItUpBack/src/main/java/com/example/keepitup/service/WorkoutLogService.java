package com.example.keepitup.service;


import com.example.keepitup.model.dtos.ExerciseDTO;
import com.example.keepitup.model.dtos.WorkoutLogDTO;
import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;

import java.util.List;

public interface WorkoutLogService {

    List<WorkoutLogDTO> getAllWorkoutLogs();
    WorkoutLogDTO createWorkoutLog(WorkoutLogDTO workoutLogDTO);
    List<WorkoutLogDTO> getWorkoutLogsForUser(Integer userId);
    WorkoutLogDTO getWorkoutLogById(Integer id);
    void deleteWorkoutLog(Integer id);
    WorkoutLogDTO getWorkoutLogByUserIdAndIsEditing(Integer userId, Integer workoutId, Boolean isEditing, Integer gymId);
    WorkoutLogDTO updateWorkoutLog(Integer id, WorkoutLogDTO workoutLogDTO);
    ExerciseDTO getExerciseById(Integer exerciseId);
    void reorderExercises(Integer id, List<WorkoutLogExerciseDTO> exercises);
    WorkoutLogDTO getLastCompletedWorkoutLog(Integer userId, Integer workoutId, Integer gymId);
    void updateGymId(Integer workoutLogId, Integer gymId);

}
