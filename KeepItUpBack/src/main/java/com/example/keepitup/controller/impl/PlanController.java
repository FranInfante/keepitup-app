package com.example.MoreGains.controller.impl;

import com.example.MoreGains.controller.PlanApi;
import com.example.MoreGains.model.dtos.PlanDTO;
import com.example.MoreGains.model.dtos.UpdatePlanNameDTO;
import com.example.MoreGains.model.dtos.WorkoutDTO;
import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;
import com.example.MoreGains.service.PlanService;
import com.example.MoreGains.util.UriConstants;
import com.example.MoreGains.util.messages.MessageConstants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(UriConstants.PLANS)
public class PlanController implements PlanApi {

    private final PlanService planService;

    @Override
    public ResponseEntity<PlanDTO> getPlanById(@PathVariable Integer id) {
        PlanDTO plan = planService.getPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @Override
    public ResponseEntity<List<PlanDTO>> getAllPlans() {
        List<PlanDTO> plans = planService.getAllPlans();
        return ResponseEntity.ok(plans);
    }

    @Override
    public ResponseEntity<List<PlanDTO>> getPlansByUserId(@PathVariable Integer userId) {
        List<PlanDTO> plans = planService.getPlansByUserId(userId);
        return ResponseEntity.ok(plans);
    }

    @Override
    public ResponseEntity<PlanDTO> createPlan(@RequestBody PlanDTO newPlan) throws Exception {
        PlanDTO createdPlan = planService.savePlan(newPlan);
        return ResponseEntity.ok(createdPlan);
    }

    @Override
    public ResponseEntity<PlanDTO> updatePlan(@PathVariable Integer id, @RequestBody PlanDTO updatePlan) throws Exception {
        PlanDTO updatedPlan = planService.updatePlan(id, updatePlan).orElseThrow(() -> new EntityNotFoundException(MessageConstants.PLAN_NOT_FOUND));
        return ResponseEntity.ok(updatedPlan);
    }

    @Override
    public ResponseEntity<Void> deletePlan(@PathVariable Integer id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<WorkoutDTO> addWorkoutToPlan(@PathVariable Integer planId, @RequestBody WorkoutDTO workoutDTO) throws Exception {
        WorkoutDTO newWorkout = planService.addWorkoutToPlan(planId, workoutDTO);
        return ResponseEntity.ok(newWorkout);
    }

    @Override
    public ResponseEntity<WorkoutDTO> addExerciseToWorkout(@PathVariable Integer planId, @PathVariable Integer workoutId, @RequestBody WorkoutExerciseDTO exerciseDTO) throws Exception {
        WorkoutDTO updatedWorkout = planService.addExerciseToWorkout(planId, workoutId, exerciseDTO);
        return ResponseEntity.ok(updatedWorkout);
    }

    @Override
    public ResponseEntity<Void> deleteWorkoutExercise(
            @PathVariable Integer planId,
            @PathVariable Integer workoutId,
            @PathVariable Integer exerciseId) throws Exception {
        planService.deleteWorkoutExercise(planId, workoutId, exerciseId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> deleteWorkoutinPlan(
            @PathVariable Integer planId,
            @PathVariable Integer workoutId){
        planService.deleteWorkout(planId, workoutId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<WorkoutExerciseDTO> getWorkoutExercise(
            @PathVariable Integer planId,
            @PathVariable Integer workoutId,
            @PathVariable Integer exerciseId) throws Exception {
        WorkoutExerciseDTO workoutExerciseDTO = planService.getWorkoutExercise(planId, workoutId, exerciseId);
        return ResponseEntity.ok(workoutExerciseDTO);
    }

    @Override
    public ResponseEntity<Void> reorderWorkouts(Integer planId, List<Integer> workoutIds) throws Exception {
            planService.reorderWorkouts(planId, workoutIds);
            return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<PlanDTO> updatePlanName(@PathVariable Integer id, @RequestBody UpdatePlanNameDTO updatePlanNameDTO) {
        try {
            PlanDTO updatedPlan = planService.updatePlanName(id, updatePlanNameDTO.getName());
            return ResponseEntity.ok(updatedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
