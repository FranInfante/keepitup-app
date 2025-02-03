package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.MuscleGroupDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.MUSCLE_GROUPS)
public interface MuscleGroupApi {

    @GetMapping
    ResponseEntity<List<MuscleGroupDTO>> getAllMuscleGroups();

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<MuscleGroupDTO> getMuscleGroupById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<MuscleGroupDTO> createMuscleGroup(@RequestBody MuscleGroupDTO newMuscleGroup) throws Exception;

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteMuscleGroupById(@PathVariable Integer id);

    @PutMapping(UriConstants.BY_ID)
    ResponseEntity<Void> updateMuscleGroup(@PathVariable Integer id, @RequestBody MuscleGroupDTO updateMuscleGroup) throws Exception;
}