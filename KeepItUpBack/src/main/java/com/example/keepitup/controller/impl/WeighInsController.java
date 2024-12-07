package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.WeighInsApi;
import com.example.keepitup.model.dtos.WeighInsDTO;
import com.example.keepitup.service.WeighInsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WeighInsController implements WeighInsApi {

    private final WeighInsService weighInsService;

    @Override
    public ResponseEntity<WeighInsDTO> logWeighIn(WeighInsDTO weighInDTO) {
        WeighInsDTO loggedWeighIn = weighInsService.logWeighIn(weighInDTO);
        return ResponseEntity.status(201).body(loggedWeighIn);
    }

    @Override
    public ResponseEntity<List<WeighInsDTO>> getWeighInsByUserId(Integer userId) {
        List<WeighInsDTO> weighIns = weighInsService.getWeighInsByUserId(userId);
        return ResponseEntity.ok(weighIns);
    }

    @Override
    public ResponseEntity<Void> deleteWeighIn(Integer id) {
        weighInsService.deleteWeighIn(id);
        return ResponseEntity.ok().build();
    }
}
