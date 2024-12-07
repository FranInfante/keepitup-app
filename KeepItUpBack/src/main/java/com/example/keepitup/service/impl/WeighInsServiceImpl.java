package com.example.keepitup.service.impl;

import com.example.keepitup.model.dtos.WeighInsDTO;
import com.example.keepitup.model.entities.Users;
import com.example.keepitup.model.entities.WeighIns;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.repository.WeighInsRepository;
import com.example.keepitup.service.WeighInsService;
import com.example.keepitup.util.mappers.WeighInsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeighInsServiceImpl implements WeighInsService {

    private final WeighInsRepository weighInsRepository;
    private final UsersRepository usersRepository;

    @Override
    public WeighInsDTO logWeighIn(WeighInsDTO weighInDTO) {
        Users user = usersRepository.findById(weighInDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + weighInDTO.getUserId()));

        WeighIns weighIn = WeighInsMapper.weighInsDTOToEntity(weighInDTO);
        weighIn.setUser(user);

        WeighIns savedWeighIn = weighInsRepository.save(weighIn);
        return WeighInsMapper.weighInsEntityToDTO(savedWeighIn);
    }

    @Override
    public List<WeighInsDTO> getWeighInsByUserId(Integer userId) {
        List<WeighIns> weighIns = weighInsRepository.findByUserId(userId);
        return WeighInsMapper.listWeighInsEntityToDTO(weighIns);
    }
    @Override
    public void deleteWeighIn(Integer weighInId) {
        weighInsRepository.deleteById(weighInId);
    }
}