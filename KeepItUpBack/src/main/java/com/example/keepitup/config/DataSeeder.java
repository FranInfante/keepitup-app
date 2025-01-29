package com.example.keepitup.config;


import com.example.keepitup.model.entities.*;
import com.example.keepitup.model.enums.MuscleGroupType;
import com.example.keepitup.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MuscleGroupRepository muscleGroupRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        modifyMuscleGroupConstraint();
        seedData();
    }

    @Transactional
    public void seedData() {
        seedMuscleGroups();
    }


    @Transactional
    public void seedMuscleGroups() {
        List<MuscleGroup> muscleGroups = Arrays.asList(
                MuscleGroup.builder().name(MuscleGroupType.LEGS).build(),
                MuscleGroup.builder().name(MuscleGroupType.BACK).build(),
                MuscleGroup.builder().name(MuscleGroupType.CHEST).build(),
                MuscleGroup.builder().name(MuscleGroupType.ARMS).build(),
                MuscleGroup.builder().name(MuscleGroupType.SHOULDERS).build(),
                MuscleGroup.builder().name(MuscleGroupType.HAMSTRINGS).build(),
                MuscleGroup.builder().name(MuscleGroupType.QUADS).build(),
                MuscleGroup.builder().name(MuscleGroupType.GLUTES).build(),
                MuscleGroup.builder().name(MuscleGroupType.BICEPS).build(),
                MuscleGroup.builder().name(MuscleGroupType.FOREARMS).build(),
                MuscleGroup.builder().name(MuscleGroupType.OTHER).build(),
                MuscleGroup.builder().name(MuscleGroupType.TRICEPS).build()

        );

        muscleGroups.forEach(muscleGroup -> {
            if (muscleGroupRepository.findByName(muscleGroup.getName()) == null) {
                muscleGroupRepository.save(muscleGroup);
            }
        });
    }

    @Transactional
    public void modifyMuscleGroupConstraint() {
        entityManager.createNativeQuery("ALTER TABLE muscle_group DROP CONSTRAINT IF EXISTS muscle_group_name_check").executeUpdate();

        entityManager.createNativeQuery(
                "ALTER TABLE muscle_group ADD CONSTRAINT muscle_group_name_check " +
                        "CHECK (name IN ('LEGS', 'BACK', 'CHEST', 'ARMS', 'SHOULDERS', 'HAMSTRINGS', 'QUADS', 'GLUTES', 'BICEPS', 'FOREARMS', 'OTHER', 'TRICEPS'))"
        ).executeUpdate();
    }
}