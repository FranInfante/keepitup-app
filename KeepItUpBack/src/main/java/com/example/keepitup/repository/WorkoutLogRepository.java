package com.example.keepitup.repository;

import com.example.keepitup.model.entities.WorkoutLog;
import com.example.keepitup.model.entities.Workouts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Integer> {
    List<WorkoutLog> findByUserId(Integer userId);
    Optional<WorkoutLog> findFirstByUserIdAndWorkoutIdAndIsEditing(Integer userId, Integer workoutId, Boolean isEditing);
    Optional<WorkoutLog> findFirstByUserIdAndWorkoutIdAndIsEditingFalseOrderByDateDesc(Integer userId, Integer workoutId);


    List<WorkoutLog> findByWorkoutId(Integer id);

    List<WorkoutLog> findByWorkout(Workouts workout);

    void deleteByUserId(Integer userId);
}
