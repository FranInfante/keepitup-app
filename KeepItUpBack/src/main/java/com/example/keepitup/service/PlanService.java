package com.example.MoreGains.service;

import com.example.MoreGains.model.dtos.PlanDTO;
import com.example.MoreGains.model.dtos.WorkoutDTO;
import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;

import java.util.List;
import java.util.Optional;

public interface PlanService {
    List<PlanDTO> getAllPlans();
    PlanDTO getPlanById(Integer id);
    PlanDTO savePlan(PlanDTO planDTO);
    void deletePlan(Integer id);
    List<PlanDTO> getPlansByUserId(Integer userId);
    Optional<PlanDTO> updatePlan(Integer id, PlanDTO updatePlan) throws Exception;
    WorkoutDTO addWorkoutToPlan(Integer planId, WorkoutDTO workoutDTO) throws Exception;
    void deleteWorkoutExercise(Integer planId, Integer workoutId, Integer exerciseId) throws Exception;
    WorkoutExerciseDTO getWorkoutExercise(Integer planId, Integer workoutId, Integer exerciseId) throws Exception;
    WorkoutDTO addExerciseToWorkout(Integer planId, Integer workoutId, WorkoutExerciseDTO exerciseDTO) throws Exception;
    void reorderWorkouts(Integer planId, List<Integer> workoutIds)throws Exception;
    PlanDTO updatePlanName(Integer id, String name) throws Exception;
    void deleteWorkout(Integer planId, Integer workoutId);
}