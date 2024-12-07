package com.example.keepitup.controller;

import com.example.keepitup.model.dtos.WeighInsDTO;
import com.example.keepitup.util.UriConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(UriConstants.WEIGHINS)
public interface WeighInsApi {

    @PostMapping
    ResponseEntity<WeighInsDTO> logWeighIn(@RequestBody WeighInsDTO weighInDTO);

    @GetMapping(UriConstants.BY_ID)
    ResponseEntity<List<WeighInsDTO>> getWeighInsByUserId(@PathVariable("id") Integer userId);

    @DeleteMapping(UriConstants.BY_ID)
    ResponseEntity<Void> deleteWeighIn(@PathVariable("id") Integer userId);
}
