package com.example.keepitup.repository;


import com.example.keepitup.model.entities.WorkoutLogExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutLogExerciseRepository extends JpaRepository<WorkoutLogExercise, Integer> {
    List<WorkoutLogExercise> findByWorkoutLogId(Integer workoutLogId);

    List<WorkoutLogExercise> findByWorkoutLogIdAndExerciseId(Integer workoutLogId, Integer exerciseId);

    void deleteByWorkoutLogId(Integer id);
}
