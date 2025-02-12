package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.GymDTO;
import com.example.keepitup.service.GymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GymController implements GymApi{

    private final GymService gymService;

    @Override
    public ResponseEntity<GymDTO> createGym(@RequestBody GymDTO gymDTO) {
        GymDTO createdGym = gymService.createGym(gymDTO);

        // If null is returned, it means the gym limit was reached
        if (createdGym == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdGym);
    }

    @Override
    public ResponseEntity<List<GymDTO>> getUserGyms(Integer userId) {
        return ResponseEntity.ok(gymService.getUserGyms(userId));
    }

    @Override
    public ResponseEntity<Void> deleteGymById(Integer id) {
        gymService.deleteGym(id);
        return ResponseEntity.noContent().build();
    }
}
