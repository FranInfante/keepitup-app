package com.example.keepitup.service.impl;

import com.example.keepitup.model.dtos.GymDTO;
import com.example.keepitup.model.entities.Gym;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.GymRepository;
import com.example.keepitup.repository.UsersRepository;
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

    @Override
    public GymDTO createGym(GymDTO gymDTO) {
        Users user = usersRepository.findById(gymDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long gymCount = gymRepository.countByUserId(user.getId());

        // If the user already has 5 gyms, return null so the controller can handle the 409 response
        if (gymCount >= 5) {
            return null;
        }

        Gym gym = Gym.builder()
                .user(user)
                .name(gymDTO.getName())
                .build();

        Gym savedGym = gymRepository.save(gym);
        return new GymDTO(savedGym.getId(), savedGym.getUser().getId(), savedGym.getName());
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
        gymRepository.delete(gym);
    }
}
