package com.smhrd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.smhrd.entity.Sensing;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SensingRepository extends JpaRepository<Sensing, Integer> {
    
    // 새로운 센서 데이터 삽입 (네이티브 쿼리 사용)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tb_sensing (sensor_id, sensor_url, sensor_res, sensor_state) VALUES (:sensorId, :sensorUrl, :sensorRes, :sensorState)", nativeQuery = true)
    int insertSensingData(@Param("sensorId") Integer sensorId,
                          @Param("sensorUrl") String sensorUrl,
                          @Param("sensorRes") BigDecimal sensorRes,
                          @Param("sensorState") String sensorState);

    @Query(value = "SELECT * FROM tb_sensing ORDER BY sensing_at DESC", nativeQuery = true)
    List<Sensing> getSensing();                          

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tb_sensing WHERE sensor_id = :sensorId", nativeQuery = true)
    int deleteSensingData(@Param("sensorId") Integer sensorId);

}
