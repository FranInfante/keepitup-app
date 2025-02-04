package com.example.keepitup.repository;

import com.example.keepitup.model.entities.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer> {
    List<Plan> findByUserId(Integer userId);

    void deleteByUserId(Integer userId);
}
