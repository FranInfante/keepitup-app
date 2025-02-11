package com.example.keepitup.repository;

import com.example.keepitup.model.entities.Workouts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface WorkoutsRepository extends JpaRepository<Workouts, Integer> {

    List<Workouts> findByUserId(Integer userId);

    @Query("SELECT DISTINCT w.name FROM Workouts w WHERE w.user.id = :userId")
    List<String> findDistinctWorkoutNamesByUserId(@Param("userId") Integer userId);

    void deleteByUserId(Integer userId);
}