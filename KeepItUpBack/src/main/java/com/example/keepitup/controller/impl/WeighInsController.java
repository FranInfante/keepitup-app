package com.example.keepitup.controller.impl;

import com.example.keepitup.controller.WeighInsApi;
import com.example.keepitup.model.dtos.WeighInsDTO;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.service.WeighInsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WeighInsController implements WeighInsApi {

    private final WeighInsService weighInsService;
    private final UsersRepository usersRepository;


    @Override
    public ResponseEntity<List<WeighInsDTO>> getWeighInsByUserId(Integer userId) {
        List<WeighInsDTO> weighIns = weighInsService.getWeighInsByUserId(userId);
        return ResponseEntity.ok(weighIns);
    }

    @Override
    public ResponseEntity<WeighInsDTO> logWeighIn(@RequestBody WeighInsDTO weighInDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        if (!weighInDTO.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to log a weigh-in for another user.");
        }

        WeighInsDTO loggedWeighIn = weighInsService.logWeighIn(weighInDTO);
        return ResponseEntity.status(201).body(loggedWeighIn);
    }

    @Override
    public ResponseEntity<Void> deleteWeighIn(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users currentUser = usersRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        WeighInsDTO weighIn = weighInsService.getWeighInById(id);
        if (!weighIn.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this weigh-in.");
        }

        weighInsService.deleteWeighIn(id);
        return ResponseEntity.ok().build();
    }
}
