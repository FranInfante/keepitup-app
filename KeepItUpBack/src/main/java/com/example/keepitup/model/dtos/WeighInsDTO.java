package com.example.keepitup.model.dtos;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeighInsDTO {
    private Integer id;
    private Integer userId;
    private double weight;
    private LocalDate date;
}