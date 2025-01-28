package com.example.keepitup.repository;

import com.example.keepitup.model.entities.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    Optional<Exercise> findByNameIgnoreCase(String name);

    List<Exercise> findByUserIdIsNullOrUserId(Integer userId);

    Optional<Exercise> findByNameIgnoreCaseAndUserId(String name, Integer userId);

    Optional<Exercise> findFirstByNameIgnoreCase(String exerciseName);

    List<Exercise> findAllByUserIdAndIsAvailableTrue(Integer userId);
}