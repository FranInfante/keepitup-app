package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetDTO {
    private Integer set;
    private Integer reps;
    private Double weight;
}
