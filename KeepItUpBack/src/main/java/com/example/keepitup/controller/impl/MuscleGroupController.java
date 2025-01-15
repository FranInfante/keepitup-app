package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.MuscleGroupApi;
import com.example.keepitup.model.dtos.MuscleGroupDTO;
import com.example.keepitup.service.MuscleGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MuscleGroupController implements MuscleGroupApi {

    private final MuscleGroupService muscleGroupService;

    @Override
    public ResponseEntity<List<MuscleGroupDTO>> getAllMuscleGroups() {
        List<MuscleGroupDTO> muscleGroups = muscleGroupService.getAllMuscleGroups();
        return ResponseEntity.ok(muscleGroups);
    }

    @Override
    public ResponseEntity<MuscleGroupDTO> getMuscleGroupById(Integer id) {
        MuscleGroupDTO muscleGroup = muscleGroupService.getMuscleGroupById(id);
        return ResponseEntity.ok(muscleGroup);
    }

    @Override
    public ResponseEntity<MuscleGroupDTO> createMuscleGroup(MuscleGroupDTO newMuscleGroup) throws Exception {
        MuscleGroupDTO createdMuscleGroup = muscleGroupService.saveMuscleGroup(newMuscleGroup);
        return ResponseEntity.ok(createdMuscleGroup);
    }

    @Override
    public ResponseEntity<Void> deleteMuscleGroupById(Integer id) {
        muscleGroupService.deleteMuscleGroup(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> updateMuscleGroup(Integer id, MuscleGroupDTO updateMuscleGroup) throws Exception {
        muscleGroupService.saveMuscleGroup(updateMuscleGroup);
        return ResponseEntity.noContent().build();
    }
}