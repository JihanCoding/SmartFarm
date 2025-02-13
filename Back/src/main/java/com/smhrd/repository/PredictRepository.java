package com.smhrd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smhrd.entity.PredictData;

@Repository
public interface PredictRepository extends JpaRepository<PredictData, Integer> {

}