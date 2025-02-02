package com.smhrd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.smhrd.entity.PastData;

@Repository
public interface PastDataRepository extends JpaRepository<PastData, Integer> {

    @Query(value = "SELECT * FROM tb_env_data WHERE DATE_FORMAT(observed_at, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d') ORDER BY DATE_FORMAT(observed_at, '%Y') ASC", nativeQuery = true)
    List<PastData> findDataByCurrentMonthDaySortedByYearNative();

    @Query(value = "SELECT * FROM tb_env_data " +
               "WHERE observed_at >= (SELECT DATE_SUB(MAX(observed_at), INTERVAL 30 DAY) FROM tb_env_data) " +
               "ORDER BY observed_at ASC",
       nativeQuery = true)
    List<PastData> findLatestThreeDaysData();

}