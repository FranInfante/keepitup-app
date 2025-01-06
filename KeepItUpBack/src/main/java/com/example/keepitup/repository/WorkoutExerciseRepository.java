package com.example.keepitup.repository;

import com.example.keepitup.model.entities.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Integer> {
    List<WorkoutExercise> findByWorkoutId(Integer workoutId);
}
