package com.example.keepitup.repository;

import com.example.keepitup.model.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUsername(String users);

    Optional<Users> findByUsernameIgnoreCase(String username);

    Optional<Users> findByEmail(String username);

    List<Users> findUsersByUsernameIgnoreCase(String username);
}