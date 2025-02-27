package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.PlanApi;
import com.example.keepitup.model.dtos.*;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.service.PlanService;
import com.example.keepitup.util.msgs.MessageConstants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PlanController implements PlanApi {

    private final PlanService planService;
    private final UsersRepository usersRepository;


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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        if (!newPlan.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to create a plan for this user.");
        }

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        PlanDTO plan = planService.getPlanById(id);
        if (!plan.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this plan.");
        }

        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }


    @Override
    public ResponseEntity<WorkoutsDTO> addWorkoutToPlan(@PathVariable Integer planId, @RequestBody WorkoutsDTO workoutsDTO) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        PlanDTO plan = planService.getPlanById(planId);
        if (!plan.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to add workouts to this plan.");
        }

        WorkoutsDTO newWorkout = planService.addWorkoutToPlan(planId, workoutsDTO);
        return ResponseEntity.ok(newWorkout);
    }


    @Override
    public ResponseEntity<WorkoutsDTO> addExerciseToWorkout(
            @PathVariable Integer planId,
            @PathVariable Integer workoutId,
            @RequestBody WorkoutExerciseDTO exerciseDTO) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        PlanDTO plan = planService.getPlanById(planId);

        if (!plan.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to add exercises to this plan.");
        }

        WorkoutsDTO updatedWorkout = planService.addExerciseToWorkout(planId, workoutId, exerciseDTO);
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
    public ResponseEntity<Void> deleteWorkoutinPlan(@PathVariable Integer planId, @PathVariable Integer workoutId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        PlanDTO plan = planService.getPlanById(planId);

        if (!plan.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to delete workouts from this plan.");
        }

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
