package com.example.keepitup.repository;

import com.example.keepitup.model.entities.WeighIns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface WeighInsRepository extends JpaRepository<WeighIns, Integer> {

    List<WeighIns> findByUserId(Integer userId);

    void deleteByUserId(Integer userId);
}