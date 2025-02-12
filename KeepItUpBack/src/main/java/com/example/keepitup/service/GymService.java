package com.example.keepitup.service;

import com.example.keepitup.model.dtos.GymDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface GymService {
    GymDTO createGym(GymDTO gymDTO);
    List<GymDTO> getUserGyms(Integer userId);
    void deleteGym(Integer id);

}
