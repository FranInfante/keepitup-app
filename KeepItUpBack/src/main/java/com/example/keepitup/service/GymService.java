package com.example.keepitup.service;

import com.example.keepitup.model.dtos.GymDTO;
import com.example.keepitup.model.dtos.GymResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface GymService {
    GymResponseDTO createGym(GymDTO gymDTO);
    List<GymDTO> getUserGyms(Integer userId);
    void deleteGym(Integer gymId, Integer userId);

}
