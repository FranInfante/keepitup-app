package com.example.keepitup.service.impl;

import com.example.keepitup.model.dtos.WorkoutsDTO;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.model.entities.WeighIns;
import com.example.keepitup.model.entities.WorkoutLog;
import com.example.keepitup.model.entities.Workouts;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.repository.WorkoutLogRepository;
import com.example.keepitup.repository.WorkoutsRepository;
import com.example.keepitup.service.WorkoutsService;
import com.example.keepitup.util.mappers.WeighInsMapper;
import com.example.keepitup.util.mappers.WorkoutsMapper;
import com.example.keepitup.util.msgs.MessageConstants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutsServiceImpl implements WorkoutsService {

    private final WorkoutsRepository workoutsRepository;
    private final UsersRepository usersRepository;


    @Override
    public WorkoutsDTO logWorkout(WorkoutsDTO workoutDTO) {
        Users user = usersRepository.findById(workoutDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + workoutDTO.getUserId()));

        Workouts workout = WorkoutsMapper.workoutsDTOToEntity(workoutDTO);
        workout.setUser(user);

        Workouts savedWorkout = workoutsRepository.save(workout);
        return WorkoutsMapper.workoutsEntityToDTO(savedWorkout);
    }

    @Override
    public List<WorkoutsDTO> getWorkoutsByUserId(Integer userId) {
        List<Workouts> workouts = workoutsRepository.findByUserId(userId);
        return WorkoutsMapper.listWorkoutEntityToDTO(workouts);
    }

    @Override
    public List<String> getDistinctWorkoutNamesByUserId(Integer userId) {
        return workoutsRepository.findDistinctWorkoutNamesByUserId(userId);
    }


    @Override
    public WorkoutsDTO updateWorkoutName(Integer id, String name) throws Exception {
        Workouts workout = workoutsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_NOT_FOUND));

        if (name != null) {
            workout.setName(name);
        }

        Workouts savedWorkout = workoutsRepository.save(workout);
        return WorkoutsMapper.workoutsEntityToDTO(savedWorkout);
    }

    @Override
    public WorkoutsDTO getWorkoutById(Integer id) {
        Workouts workout = workoutsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_NOT_FOUND));
        return WorkoutsMapper.workoutsEntityToDTO(workout);
    }

    @Override
    public void deleteWorkout(Integer id) {
        Workouts workout = workoutsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_NOT_FOUND));
        workout.setIsAvailable(false);
        workoutsRepository.save(workout);
    }

}