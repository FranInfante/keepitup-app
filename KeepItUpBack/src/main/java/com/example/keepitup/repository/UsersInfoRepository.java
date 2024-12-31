package com.example.keepitup.repository;

import com.example.keepitup.model.entities.UsersInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UsersInfoRepository extends JpaRepository<UsersInfo, Integer> {

    Optional<UsersInfo> findByUserId(Integer userId);


}