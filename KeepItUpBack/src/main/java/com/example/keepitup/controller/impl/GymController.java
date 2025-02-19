package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.GymDTO;
import com.example.keepitup.model.dtos.GymResponseDTO;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.service.GymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GymController implements GymApi{

    private final GymService gymService;
    private final UsersRepository usersRepository;


    @Override
    public ResponseEntity<GymResponseDTO> createGym(@RequestBody GymDTO gymDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        // ✅ Prevent users from creating gyms for other users
        if (!gymDTO.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to create a gym for this user.");
        }

        GymResponseDTO response = gymService.createGym(gymDTO);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @Override
    public ResponseEntity<List<GymDTO>> getUserGyms(@PathVariable Integer userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        // ✅ Ensure the user can only retrieve their own gyms
        if (!userId.equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to view these gyms.");
        }

        return ResponseEntity.ok(gymService.getUserGyms(userId));
    }

    @Override
    public ResponseEntity<Void> deleteGymById(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        gymService.deleteGym(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
