package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.GymDTO;
import com.example.keepitup.model.dtos.GymResponseDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.GYM)
public interface GymApi{

    @PostMapping
    ResponseEntity<GymResponseDTO> createGym(@RequestBody GymDTO gymDTO);

    @GetMapping(UriConstants.GET_GYM_BY_ID)
    ResponseEntity<List<GymDTO>> getUserGyms(@PathVariable Integer userId);

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteGymById(@PathVariable Integer id);
}
