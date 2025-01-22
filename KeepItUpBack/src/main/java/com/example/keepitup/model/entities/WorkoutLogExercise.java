package com.example.keepitup.model.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutLogExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "workout_log_id", nullable = false)
    private WorkoutLog workoutLog;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false)
    private Integer set;

    @Column(nullable = true)
    private Integer reps;

    @Column(nullable = true)
    private Double weight;

    @Column(nullable = true)
    private String notes;

    @Column(nullable = true)
    private Integer exerciseOrder;
}
