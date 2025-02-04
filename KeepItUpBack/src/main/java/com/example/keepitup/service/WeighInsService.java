package com.example.keepitup.service;


import com.example.keepitup.model.dtos.WeighInsDTO;

import java.util.List;

public interface WeighInsService {
    WeighInsDTO logWeighIn(WeighInsDTO weighInDTO);
    List<WeighInsDTO> getWeighInsByUserId(Integer userId);
    void deleteWeighIn(Integer weighInId);
    WeighInsDTO getWeighInById(Integer weighInId);

}