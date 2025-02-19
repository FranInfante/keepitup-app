package com.example.keepitup.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GymResponseDTO {
    private boolean success;
    private String message;
}
