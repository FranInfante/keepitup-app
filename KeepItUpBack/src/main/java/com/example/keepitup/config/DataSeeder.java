package com.example.keepitup.config;

import java.time.LocalDate;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.keepitup.model.entities.Users;
import com.example.keepitup.model.entities.UsersInfo;
import com.example.keepitup.model.entities.WeighIns;
import com.example.keepitup.model.entities.Workouts;
import com.example.keepitup.repository.UsersRepository;
import com.example.keepitup.repository.WeighInsRepository;
import com.example.keepitup.repository.WorkoutsRepository;

import lombok.RequiredArgsConstructor;



@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final WorkoutsRepository workoutsRepository;
    private final WeighInsRepository weighInsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsersAndUserInfo();
        seedWorkouts();
        seedWeighIns();
    }

    private void seedUsersAndUserInfo() {
        Users user1 = Users.builder()
                .username("user1")
                .email("user1@example.com")
                .password(passwordEncoder.encode("password"))
                .build();

        Users user2 = Users.builder()
                .username("user2")
                .email("user2@example.com")
                .password(passwordEncoder.encode("passwords"))
                .build();

        UsersInfo usersInfo1 = UsersInfo.builder()
                .initialWeight(85.0)
                .goalWeight(75.0)
                .workoutDaysPerWeek(4)
                .user(user1) // Set the relationship
                .build();

        UsersInfo usersInfo2 = UsersInfo.builder()
                .initialWeight(90.0)
                .goalWeight(80.0)
                .workoutDaysPerWeek(3)
                .user(user2) // Set the relationship
                .build();

        // Set bidirectional relationships
        user1.setUsersInfo(usersInfo1);
        user2.setUsersInfo(usersInfo2);

        usersRepository.saveAll(Arrays.asList(user1, user2));
    }

    private void seedWorkouts() {
        Users user1 = usersRepository.findByUsername("user1").orElseThrow(() -> new RuntimeException("User1 not found"));
        Users user2 = usersRepository.findByUsername("user2").orElseThrow(() -> new RuntimeException("User2 not found"));

        Workouts[] workouts = {
                Workouts.builder()
                        .user(user1)
                        .name("Morning Cardio")
                        .date(LocalDate.now())
                        .build(),
                Workouts.builder()
                        .user(user1)
                        .name("Leg Day")
                        .date(LocalDate.now().plusDays(1))
                        .build(),
                Workouts.builder()
                        .user(user2)
                        .name("Chest Day")
                        .date(LocalDate.now())
                        .build(),
                Workouts.builder()
                        .user(user2)
                        .name("Back Day")
                        .date(LocalDate.now().plusDays(1))
                        .build()
        };

        workoutsRepository.saveAll(Arrays.asList(workouts));
    }

    private void seedWeighIns() {
        Users user1 = usersRepository.findByUsername("user1").orElseThrow(() -> new RuntimeException("User1 not found"));
        Users user2 = usersRepository.findByUsername("user2").orElseThrow(() -> new RuntimeException("User2 not found"));

        WeighIns[] weighIns = {
                WeighIns.builder()
                        .user(user1)
                        .weight(85.0)
                        .date(LocalDate.now().minusDays(2))
                        .build(),
                WeighIns.builder()
                        .user(user1)
                        .weight(84.5)
                        .date(LocalDate.now().minusDays(1))
                        .build(),
                WeighIns.builder()
                        .user(user1)
                        .weight(84.0)
                        .date(LocalDate.now())
                        .build(),
                WeighIns.builder()
                        .user(user2)
                        .weight(90.0)
                        .date(LocalDate.now().minusDays(2))
                        .build(),
                WeighIns.builder()
                        .user(user2)
                        .weight(89.8)
                        .date(LocalDate.now().minusDays(1))
                        .build(),
                WeighIns.builder()
                        .user(user2)
                        .weight(89.5)
                        .date(LocalDate.now())
                        .build()
        };

        weighInsRepository.saveAll(Arrays.asList(weighIns));
    }
}