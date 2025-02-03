package com.example.keepitup.repository;

import com.example.keepitup.model.entities.MuscleGroup;
import com.example.keepitup.model.enums.MuscleGroupType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroup, Integer> {
    MuscleGroup findByName(MuscleGroupType name);
}