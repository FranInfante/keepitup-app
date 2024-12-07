package com.example.keepitup.util.mappers;

import com.example.keepitup.model.dtos.WeighInsDTO;
import com.example.keepitup.model.entities.WeighIns;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class WeighInsMapper {

    public WeighIns weighInsDTOToEntity(WeighInsDTO weighInsDTO) {
        return WeighIns.builder()
                .id(weighInsDTO.getId())
                .weight(weighInsDTO.getWeight())
                .date(weighInsDTO.getDate())
                .build();
    }

    public WeighInsDTO weighInsEntityToDTO(WeighIns weighIns) {
        return WeighInsDTO.builder()
                .id(weighIns.getId())
                .userId(weighIns.getUser().getId())
                .weight(weighIns.getWeight())
                .date(weighIns.getDate())
                .build();
    }

    public List<WeighIns> listWeighInsDTOToEntity(List<WeighInsDTO> weighInsDTOList) {
        return weighInsDTOList.stream().map(WeighInsMapper::weighInsDTOToEntity).collect(Collectors.toList());
    }

    public List<WeighInsDTO> listWeighInsEntityToDTO(List<WeighIns> weighInsList) {
        return weighInsList.stream().map(WeighInsMapper::weighInsEntityToDTO).collect(Collectors.toList());
    }
}