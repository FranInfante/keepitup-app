package com.example.keepitup.util.mappers;

import com.example.keepitup.model.dtos.MuscleGroupDTO;
import com.example.keepitup.model.entities.MuscleGroup;
import lombok.experimental.UtilityClass;


@UtilityClass
public class MuscleGroupMapper {

    public MuscleGroup muscleGroupDTOToEntity(MuscleGroupDTO muscleGroupDTO) {
        return MuscleGroup.builder()
                .id(muscleGroupDTO.getId())
                .name(muscleGroupDTO.getName())
                .isAvailable(muscleGroupDTO.getIsAvailable())
                .build();
    }

    public MuscleGroupDTO muscleGroupEntityToDTO(MuscleGroup muscleGroup) {
        return MuscleGroupDTO.builder()
                .id(muscleGroup.getId())
                .name(muscleGroup.getName())
                .isAvailable(muscleGroup.getIsAvailable())
                .build();
    }

}