package com.example.keepitup.model.entities;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private double initialWeight;

    @Column(nullable = false)
    private double goalWeight;

    @Column(nullable = false)
    private Integer workoutDaysPerWeek;

    @Column(nullable = true)
    private String language;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

}