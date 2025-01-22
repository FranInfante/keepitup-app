package com.example.keepitup.repository;

import com.example.keepitup.model.entities.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Integer> {
    List<WorkoutLog> findByUserId(Integer userId);
    Optional<WorkoutLog> findFirstByUserIdAndIsEditing(Integer userId, Boolean isEditing);
}
