package com.example.MoreGains.service.impl;

import com.example.MoreGains.model.dtos.WorkoutExerciseDTO;
import com.example.MoreGains.model.entities.Exercise;
import com.example.MoreGains.model.entities.WorkoutExercise;
import com.example.MoreGains.repository.ExerciseRepository;
import com.example.MoreGains.repository.WorkoutExerciseRepository;
import com.example.MoreGains.repository.WorkoutRepository;
import com.example.MoreGains.service.WorkoutExerciseService;
import com.example.MoreGains.util.mappers.WorkoutExerciseMapper;
import com.example.MoreGains.util.messages.MessageConstants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutExerciseServiceImpl implements WorkoutExerciseService {

    private final WorkoutExerciseRepository workoutExerciseRepository;

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    @Override
    public List<WorkoutExerciseDTO> getAllWorkoutExercises() {
        List<WorkoutExercise> workoutExercises = workoutExerciseRepository.findAll();
        return WorkoutExerciseMapper.listWorkoutExerciseEntityToDTO(workoutExercises);
    }

    @Override
    public List<WorkoutExerciseDTO> getExercisesForWorkout(Integer workoutId) {
        List<WorkoutExercise> exercises = workoutExerciseRepository.findByWorkoutId(workoutId);
        return WorkoutExerciseMapper.listWorkoutExerciseEntityToDTO(exercises);
    }

    public WorkoutExerciseDTO saveWorkoutExercise(WorkoutExerciseDTO workoutExerciseDTO) {
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseDTO.getId())
                .orElse(new WorkoutExercise());

        Exercise exercise = exerciseRepository.findById(workoutExerciseDTO.getExerciseId())
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.EXERCISE_NOT_FOUND));

        workoutExercise.setExercise(exercise);
        workoutExercise.setExerciseOrder(workoutExerciseDTO.getExerciseOrder());
        workoutExercise.setWorkout(workoutRepository.findById(workoutExerciseDTO.getWorkoutId())
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_NOT_FOUND)));

        workoutExercise = workoutExerciseRepository.save(workoutExercise);

        return WorkoutExerciseMapper.workoutExerciseEntityToDTO(workoutExercise);
    }

    @Override
    public void deleteWorkoutExercise(Integer id) {
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_EXERCISE_NOT_FOUND));
        workoutExerciseRepository.delete(workoutExercise);
    }
}