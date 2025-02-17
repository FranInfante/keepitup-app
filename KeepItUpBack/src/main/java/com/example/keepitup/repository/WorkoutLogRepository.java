package com.example.keepitup.repository;

import com.example.keepitup.model.entities.WorkoutLog;
import com.example.keepitup.model.entities.Workouts;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Integer> {
    List<WorkoutLog> findByUserIdAndIsEditingFalse(Integer userId);
    Optional<WorkoutLog> findFirstByUserIdAndWorkoutIdAndIsEditing(Integer userId, Integer workoutId, Boolean isEditing);
    Optional<WorkoutLog> findFirstByUserIdAndWorkoutIdAndIsEditingFalseOrderByDateDesc(Integer userId, Integer workoutId);
    Optional<WorkoutLog> findFirstByUserIdAndWorkoutIdAndGymIdAndIsEditingFalseOrderByDateDesc(
            Integer userId, Integer workoutId, Integer gymId);



    List<WorkoutLog> findByWorkoutId(Integer id);

    List<WorkoutLog> findByWorkout(Workouts workout);

    void deleteByUserId(Integer userId);

    @Transactional
    @Modifying
    @Query("UPDATE WorkoutLog wl SET wl.gym = NULL WHERE wl.gym.id = :gymId")
    void setGymIdToNull(@Param("gymId") Integer gymId);
}
