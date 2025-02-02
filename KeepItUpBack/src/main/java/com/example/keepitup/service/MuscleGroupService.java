package com.example.keepitup.service;

import com.example.keepitup.model.dtos.MuscleGroupDTO;

import java.util.List;

public interface MuscleGroupService {
    List<MuscleGroupDTO> getAllMuscleGroups();
    MuscleGroupDTO getMuscleGroupById(Integer id);
    MuscleGroupDTO saveMuscleGroup(MuscleGroupDTO muscleGroupDTO);
    void deleteMuscleGroup(Integer id);
}