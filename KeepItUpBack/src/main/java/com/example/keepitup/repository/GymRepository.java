package com.example.keepitup.repository;

import com.example.keepitup.model.entities.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GymRepository extends JpaRepository<Gym, Integer> {
    List<Gym> findByUserId(Integer userId);

    long countByUserId(Integer id);
}
