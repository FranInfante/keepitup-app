package com.example.keepitup.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeighIns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private double weight;

    @Column(nullable = false)
    private LocalDate date;

}