package com.example.keepitup.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.keepitup.model.entities.*;
import com.example.keepitup.repository.*;
import org.springframework.stereotype.Service;

import com.example.keepitup.model.dtos.ExerciseDTO;
import com.example.keepitup.model.dtos.WorkoutLogDTO;
import com.example.keepitup.model.dtos.WorkoutLogExerciseDTO;
import com.example.keepitup.service.WorkoutLogService;
import com.example.keepitup.util.mappers.ExerciseMapper;
import com.example.keepitup.util.mappers.WorkoutLogMapper;
import com.example.keepitup.util.msgs.MessageConstants;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkoutLogServiceImpl implements WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final UsersRepository userRepository;
    private final WorkoutsRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final GymRepository gymRepository;



    @Override
    public List<WorkoutLogDTO> getAllWorkoutLogs() {
        return workoutLogRepository.findAll()
                .stream()
                .map(WorkoutLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutLogDTO createWorkoutLog(WorkoutLogDTO workoutLogDTO) {
        // Fetch the user and workout from the repository
        Users user = userRepository.findById(workoutLogDTO.getUserId())
                .orElseThrow(() -> new RuntimeException(MessageConstants.USER_NOT_FOUND));

        Workouts workout = workoutRepository.findById(workoutLogDTO.getWorkoutId())
                .orElseThrow(() -> new RuntimeException(MessageConstants.WORKOUT_NOT_FOUND));

        // Convert gymId = 0 to null before querying
        Gym gym = null;
        if (workoutLogDTO.getGymId() != null && workoutLogDTO.getGymId() != 0) {
            gym = gymRepository.findById(workoutLogDTO.getGymId())
                    .orElseThrow(() -> new RuntimeException("Gym not found"));
        }

        // Create the WorkoutLog entity
        WorkoutLog workoutLog = WorkoutLog.builder()
                .user(user)
                .workout(workout)
                .date(workoutLogDTO.getDate())
                .isEditing(workoutLogDTO.isEditing())
                .gym(gym) // Gym can be null
                .build();

        // Iterate through exercises and create sets
        List<WorkoutLogExercise> exercises = workoutLogDTO.getExercises().stream()
                .flatMap(exerciseDTO -> exerciseDTO.getSets().stream().map(setDTO -> {
                    // Fetch the Exercise entity
                    Exercise exercise = exerciseRepository.findById(exerciseDTO.getExerciseId())
                            .orElseThrow(() -> new RuntimeException(MessageConstants.EXERCISE_NOT_FOUND));

                    // Create a WorkoutLogExercise for each set
                    return WorkoutLogExercise.builder()
                            .exercise(exercise)
                            .workoutLog(workoutLog)
                            .exerciseOrder(exerciseDTO.getExerciseOrder())
                            .set(setDTO.getSet())
                            .reps(setDTO.getReps())
                            .weight(setDTO.getWeight())
                            .notes(exerciseDTO.getNotes())
                            .build();
                }))
                .collect(Collectors.toList());

        // Ensure consistent order
        Map<Integer, Integer> exerciseOrderMap = workoutLogDTO.getExercises().stream()
                .collect(Collectors.toMap(WorkoutLogExerciseDTO::getExerciseId, WorkoutLogExerciseDTO::getExerciseOrder));

        exercises.forEach(exercise -> {
            Integer order = exerciseOrderMap.get(exercise.getExercise().getId());
            exercise.setExerciseOrder(order);
        });

        workoutLog.setExercises(exercises);

        // Save the workout log and its exercises
        WorkoutLog savedWorkoutLog = workoutLogRepository.save(workoutLog);

        // Convert back to DTO
        return WorkoutLogMapper.toDTO(savedWorkoutLog);
    }


    @Override
    public List<WorkoutLogDTO> getWorkoutLogsForUser(Integer userId) {
        return workoutLogRepository.findByUserIdAndIsEditingFalse(userId)
                .stream()
                .map(WorkoutLogMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutLogDTO getWorkoutLogById(Integer id) {
        WorkoutLog workoutLog = workoutLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MessageConstants.WORKOUT_LOG_NOT_FOUND));
        return WorkoutLogMapper.toDTO(workoutLog);
    }

    @Override
    public void deleteWorkoutLog(Integer id) {
        workoutLogRepository.deleteById(id);
    }

    @Override
    public WorkoutLogDTO getWorkoutLogByUserIdAndIsEditing(Integer userId, Integer workoutId, Boolean isEditing) {
        Optional<WorkoutLog> workoutLog = workoutLogRepository.findFirstByUserIdAndWorkoutIdAndIsEditing(userId, workoutId, isEditing);

        if (workoutLog.isEmpty()) {
            return null;
        }

        return WorkoutLogMapper.toDTO(workoutLog.get());
    }




    @Override
    public WorkoutLogDTO updateWorkoutLog(Integer id, WorkoutLogDTO workoutLogDTO) {
        WorkoutLog workoutLog = workoutLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_LOG_NOT_FOUND));

        workoutLog.setDate(workoutLogDTO.getDate());
        workoutLog.setEditing(workoutLogDTO.isEditing());

        // Update Gym if provided
        if (workoutLogDTO.getGymId() != null && workoutLogDTO.getGymId() != 0) {
            Gym gym = gymRepository.findById(workoutLogDTO.getGymId())
                    .orElseThrow(() -> new EntityNotFoundException("Gym not found"));
            workoutLog.setGym(gym);
        } else {
            workoutLog.setGym(null);
        }

        // Update exercises
        List<WorkoutLogExercise> existingExercises = workoutLog.getExercises();
        List<WorkoutLogExerciseDTO> updatedExercisesDTO = workoutLogDTO.getExercises();

        // Create a map of existing exercises for easy lookup by exerciseId
        Map<Integer, List<WorkoutLogExercise>> existingExerciseMap = existingExercises.stream()
                .collect(Collectors.groupingBy(e -> e.getExercise().getId()));

        // Update or create new sets
        List<WorkoutLogExercise> updatedExercises = updatedExercisesDTO.stream()
                .flatMap(exerciseDTO -> exerciseDTO.getSets().stream().map(setDTO -> {
                    // Fetch existing sets for this exercise from the map
                    List<WorkoutLogExercise> existingSets = existingExerciseMap.getOrDefault(exerciseDTO.getExerciseId(), new ArrayList<>());

                    // Check if a matching set already exists
                    WorkoutLogExercise existingSet = existingSets.stream()
                            .filter(set -> set.getSet().equals(setDTO.getSet()))
                            .findFirst()
                            .orElse(null);

                    if (existingSet != null) {
                        // Update the existing set
                        existingSet.setReps(setDTO.getReps());
                        existingSet.setWeight(setDTO.getWeight());
                        existingSet.setExerciseOrder(exerciseDTO.getExerciseOrder()); // Ensure order consistency
                        return existingSet;
                    } else {
                        // Create a new set if no existing one matches
                        return WorkoutLogExercise.builder()
                                .workoutLog(workoutLog)
                                .exercise(exerciseRepository.findById(exerciseDTO.getExerciseId())
                                        .orElseThrow(() -> new EntityNotFoundException(MessageConstants.EXERCISE_NOT_FOUND)))
                                .set(setDTO.getSet())
                                .reps(setDTO.getReps())
                                .weight(setDTO.getWeight())
                                .exerciseOrder(exerciseDTO.getExerciseOrder()) // Ensure order consistency
                                .build();
                    }
                }))
                .collect(Collectors.toList());

        // Remove any exercises that are no longer present
        List<WorkoutLogExercise> exercisesToRemove = existingExercises.stream()
                .filter(e -> !updatedExercises.contains(e))
                .collect(Collectors.toList());

        exercisesToRemove.forEach(workoutLog::removeExercise);

        workoutLog.setExercises(updatedExercises);

        WorkoutLog savedWorkoutLog = workoutLogRepository.save(workoutLog);
        return WorkoutLogMapper.toDTO(savedWorkoutLog);
    }




    @Override
    public ExerciseDTO getExerciseById(Integer exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.EXERCISE_NOT_FOUND));
        return ExerciseMapper.exerciseEntityToDTO(exercise);
    }
    @Override
    public void reorderExercises(Integer workoutLogId, List<WorkoutLogExerciseDTO> exercises) {
        WorkoutLog workoutLog = workoutLogRepository.findById(workoutLogId)
                .orElseThrow(() -> new RuntimeException(MessageConstants.WORKOUT_LOG_NOT_FOUND));

        // Map existing exercises by their ID
        Map<Integer, WorkoutLogExercise> existingExercises = workoutLog.getExercises()
                .stream()
                .collect(Collectors.toMap(WorkoutLogExercise::getId, e -> e));

        for (WorkoutLogExerciseDTO exerciseDTO : exercises) {
            WorkoutLogExercise exercise = existingExercises.get(exerciseDTO.getId());
            if (exercise != null) {
                // Update exercise order
                exercise.setExerciseOrder(exerciseDTO.getExerciseOrder());
            } else {
                throw new RuntimeException("Exercise ID " + exerciseDTO.getId() + " not found for workout log ID " + workoutLogId);
            }
        }

        // Save changes
        workoutLogRepository.save(workoutLog);
    }

    @Override
    public WorkoutLogDTO getLastCompletedWorkoutLog(Integer userId, Integer workoutId, Integer gymId) {
        Optional<WorkoutLog> workoutLogOptional;

        if (gymId != 0) {
            workoutLogOptional = workoutLogRepository.findFirstByUserIdAndWorkoutIdAndGymIdAndIsEditingFalseOrderByDateDesc(
                    userId, workoutId, gymId);
        } else {
            workoutLogOptional = workoutLogRepository.findFirstByUserIdAndWorkoutIdAndIsEditingFalseOrderByDateDesc(
                    userId, workoutId);
        }

        return workoutLogOptional.map(WorkoutLogMapper::toDTO).orElse(null);
    }

    @Override
    public void updateGymId(Integer workoutLogId, Integer gymId) {
        WorkoutLog workoutLog = workoutLogRepository.findById(workoutLogId)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_LOG_NOT_FOUND));

        // Handle gym assignment
        Gym gym = null;
        if (gymId != null && gymId != 0) {
            gym = gymRepository.findById(gymId)
                    .orElseThrow(() -> new EntityNotFoundException("Gym not found"));
        }

        workoutLog.setGym(gym);
        workoutLogRepository.save(workoutLog);
    }


}
