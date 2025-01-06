package com.example.MoreGains.repository;

import com.example.MoreGains.model.entities.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Integer> {
    List<WorkoutExercise> findByWorkoutId(Integer workoutId);
}
