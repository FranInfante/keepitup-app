package com.example.keepitup.service.impl;


import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.model.entities.Exercise;
import com.example.keepitup.model.entities.WorkoutLog;
import com.example.keepitup.model.entities.WorkoutLogExercise;
import com.example.keepitup.repository.ExerciseRepository;
import com.example.keepitup.repository.WorkoutLogExerciseRepository;
import com.example.keepitup.repository.WorkoutLogRepository;
import com.example.keepitup.service.WorkoutLogExerciseService;
import com.example.keepitup.util.mappers.WorkoutLogExerciseMapper;
import com.example.keepitup.util.msgs.MessageConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutLogExerciseServiceImpl implements WorkoutLogExerciseService {

    private final WorkoutLogExerciseRepository workoutLogExerciseRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final ExerciseRepository exerciseRepository;

    @Override
    public List<WorkoutLogExerciseDTO> findByWorkoutLogId(Integer workoutLogId) {
        // Correctly map `WorkoutLogExercise` to `WorkoutLogExerciseDTO`
        return workoutLogExerciseRepository.findByWorkoutLogId(workoutLogId)
                .stream()
                .map(WorkoutLogExerciseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutLogExerciseDTO addWorkoutLogExercise(WorkoutLogExerciseDTO workoutLogExerciseDTO) {
        // Find the exercise and workout log entities
        Exercise exercise = exerciseRepository.findById(workoutLogExerciseDTO.getExerciseId())
                .orElseThrow(() -> new RuntimeException(MessageConstants.EXERCISE_NOT_FOUND));

        WorkoutLog workoutLog = workoutLogRepository.findById(workoutLogExerciseDTO.getWorkoutLogId())
                .orElseThrow(() -> new RuntimeException(MessageConstants.WORKOUT_LOG_NOT_FOUND));

        // Loop through the sets and create a WorkoutLogExercise for each set
        List<WorkoutLogExercise> workoutLogExercises = workoutLogExerciseDTO.getSets().stream()
                .map(setDTO -> WorkoutLogExercise.builder()
                        .exercise(exercise)
                        .workoutLog(workoutLog)
                        .set(setDTO.getSet()) // Set number
                        .reps(setDTO.getReps())
                        .weight(setDTO.getWeight())
                        .notes(workoutLogExerciseDTO.getNotes() != null ? workoutLogExerciseDTO.getNotes() : "")
                        .build()
                ).collect(Collectors.toList());

        // Save all the exercises (multiple sets)
        List<WorkoutLogExercise> savedWorkoutLogExercises = workoutLogExerciseRepository.saveAll(workoutLogExercises);

        // Map saved entities to the DTOs
        return savedWorkoutLogExercises.stream()
                .map(WorkoutLogExerciseMapper::toDTO)
                .findFirst()
                .orElseThrow(() -> new RuntimeException(MessageConstants.WORKOUT_LOG_EXERCISE_NOT_FOUND));
    }

    @Override
    public WorkoutLogExerciseDTO updateWorkoutLogExercise(Integer id, WorkoutLogExerciseDTO workoutLogExerciseDTO) {


        // Retrieve and update existing WorkoutLogExercise
        WorkoutLogExercise workoutLogExercise = workoutLogExerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MessageConstants.WORKOUT_LOG_EXERCISE_NOT_FOUND));

        workoutLogExercise.setNotes(workoutLogExerciseDTO.getNotes());
        if (workoutLogExerciseDTO.getSets() != null && !workoutLogExerciseDTO.getSets().isEmpty()) {
            // Update with the first set provided, assuming only one set update is allowed here
            workoutLogExercise.setSet(workoutLogExerciseDTO.getSets().get(0).getSet());
            workoutLogExercise.setReps(workoutLogExerciseDTO.getSets().get(0).getReps());
            workoutLogExercise.setWeight(workoutLogExerciseDTO.getSets().get(0).getWeight());
        }

        // Save and map back to DTO
        WorkoutLogExercise updatedExercise = workoutLogExerciseRepository.save(workoutLogExercise);
        return WorkoutLogExerciseMapper.toDTO(updatedExercise);
    }

    @Override
    public void deleteWorkoutLogExercise(Integer id) {
        workoutLogExerciseRepository.deleteById(id);
    }

    @Override
    public void deleteWorkoutLogSet(Integer workoutLogId, Integer exerciseId, Integer setNumber) {
        // Find all workout log exercises by workoutLogId and exerciseId
        List<WorkoutLogExercise> exercises = workoutLogExerciseRepository.findByWorkoutLogIdAndExerciseId(workoutLogId, exerciseId);

        // Filter the list to find the set with the given set number
        WorkoutLogExercise setToDelete = exercises.stream()
                .filter(exercise -> exercise.getSet().equals(setNumber))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(MessageConstants.SET_NOT_FOUND));

        // Delete the set from the repository
        workoutLogExerciseRepository.delete(setToDelete);

        // Remove the deleted set from the list
        exercises.remove(setToDelete);

        // Reorder subsequent sets
        exercises.stream()
                .filter(exercise -> exercise.getSet() > setNumber) // Only reorder sets after the deleted one
                .forEach(exercise -> {
                    exercise.setSet(exercise.getSet() - 1); // Decrement the set number
                });

        workoutLogExerciseRepository.saveAll(exercises);
    }

}
