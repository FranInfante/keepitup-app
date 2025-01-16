package com.example.keepitup.config;


import com.example.keepitup.model.entities.*;
import com.example.keepitup.model.enums.MuscleGroupType;
import com.example.keepitup.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MuscleGroupRepository muscleGroupRepository;


    @Transactional
    @Override
    public void run(String... args) throws Exception {
        seedData();
    }

    @Transactional
    public void seedData() {
        seedMuscleGroups();
    }


    @Transactional
    public void seedMuscleGroups() {
        MuscleGroup[] muscleGroups = {
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
                MuscleGroup.builder().name(MuscleGroupType.OTHER).build()
        };

        muscleGroupRepository.saveAll(Arrays.asList(muscleGroups));
    }

}