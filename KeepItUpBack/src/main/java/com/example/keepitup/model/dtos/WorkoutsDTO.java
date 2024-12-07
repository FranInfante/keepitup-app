package com.example.keepitup.model.dtos;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutsDTO {
    private Integer id;
    private Integer userId;
    private String name;
    private LocalDate date;
}
