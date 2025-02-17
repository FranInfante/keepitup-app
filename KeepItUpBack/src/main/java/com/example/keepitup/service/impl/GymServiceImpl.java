package com.example.keepitup.service.impl;

import com.example.keepitup.model.dtos.GymDTO;
import com.example.keepitup.model.dtos.GymResponseDTO;
import com.example.keepitup.model.entities.Gym;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.GymRepository;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.repository.WorkoutLogRepository;
import com.example.keepitup.service.GymService;
import com.example.keepitup.util.msgs.MessageConstants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GymServiceImpl implements GymService {

    private final GymRepository gymRepository;
    private final UsersRepository usersRepository;
    private final WorkoutLogRepository workoutLogRepository;



    @Override
    public GymResponseDTO createGym(GymDTO gymDTO) {
        Users user = usersRepository.findById(gymDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long gymCount = gymRepository.countByUserId(user.getId());

        // If the user already has 5 gyms, return an error response
        if (gymCount >= 5) {
            return new GymResponseDTO(false, "You have reached the maximum limit of 5 gyms.");
        }

        // If a gym with the same name exists for this user, return an error response
        if (gymRepository.existsByUserIdAndName(user.getId(), gymDTO.getName())) {
            return new GymResponseDTO(false, "A gym with this name already exists.");
        }

        Gym gym = Gym.builder()
                .user(user)
                .name(gymDTO.getName())
                .build();

        gymRepository.save(gym);

        return new GymResponseDTO(true, "Gym created successfully!");
    }


    @Override
    public List<GymDTO> getUserGyms(Integer userId) {
        return gymRepository.findByUserId(userId)
                .stream()
                .map(gym -> new GymDTO(gym.getId(), gym.getUser().getId(), gym.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGym(Integer id) {
        Gym gym = gymRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageConstants.WORKOUT_NOT_FOUND));
        workoutLogRepository.setGymIdToNull(id);

        gymRepository.delete(gym);
    }
}
