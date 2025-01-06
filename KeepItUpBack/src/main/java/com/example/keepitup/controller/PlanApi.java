package com.example.MoreGains.controller;

import com.example.MoreGains.model.dtos.PlanDTO;
import com.example.MoreGains.model.dtos.UpdatePlanNameDTO;
import com.example.MoreGains.model.dtos.WorkoutDTO;
import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;
import com.example.MoreGains.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.PLANS)
public interface PlanApi {

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<PlanDTO> getPlanById(@PathVariable Integer id);

    @GetMapping
    ResponseEntity<List<PlanDTO>> getAllPlans();

    @GetMapping(UriConstants.PLANS_BY_USER_ID)
    ResponseEntity<List<PlanDTO>> getPlansByUserId(@PathVariable Integer userId);

    @PostMapping
    ResponseEntity<PlanDTO> createPlan(@RequestBody PlanDTO newPlan) throws Exception;

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<PlanDTO> updatePlan(@PathVariable Integer id, @RequestBody PlanDTO updatePlan) throws Exception;

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deletePlan(@PathVariable Integer id);

    @PostMapping(UriConstants.WORKOUTS_IN_PLAN)
    ResponseEntity<WorkoutDTO> addWorkoutToPlan(@PathVariable Integer planId, @RequestBody WorkoutDTO workoutDTO) throws Exception;

    @PostMapping(UriConstants.WORKOUT_EXERCISE_IN_PLAN_CREATE)
    ResponseEntity<WorkoutDTO> addExerciseToWorkout(@PathVariable Integer planId, @PathVariable Integer workoutId, @RequestBody WorkoutExerciseDTO exerciseDTO) throws Exception;

    @DeleteMapping(UriConstants.WORKOUT_EXERCISE_IN_PLAN)
    ResponseEntity<Void> deleteWorkoutExercise(@PathVariable Integer planId, @PathVariable Integer workoutId, @PathVariable Integer exerciseId) throws Exception;

    @GetMapping(UriConstants.WORKOUT_EXERCISE_IN_PLAN)
    ResponseEntity<WorkoutExerciseDTO> getWorkoutExercise(@PathVariable Integer planId, @PathVariable Integer workoutId, @PathVariable Integer exerciseId) throws Exception;

    @PutMapping(UriConstants.REORDER)
    ResponseEntity<Void> reorderWorkouts(@PathVariable Integer planId,
                                         @RequestBody List<Integer> workoutIds) throws Exception;

    @PatchMapping(UriConstants.UPDATE_NAME)
    ResponseEntity<PlanDTO> updatePlanName(@PathVariable Integer id, @RequestBody UpdatePlanNameDTO updatePlanNameDTO) throws Exception;

    @DeleteMapping(UriConstants.WORKOUT_IN_PLAN_DELETE)
    ResponseEntity<Void> deleteWorkoutinPlan(
            @PathVariable Integer planId,
            @PathVariable Integer workoutId);
}
