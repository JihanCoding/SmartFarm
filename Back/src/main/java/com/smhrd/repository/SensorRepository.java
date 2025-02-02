package com.smhrd.repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smhrd.entity.Sensor;

import jakarta.transaction.Transactional;


@Repository
public interface SensorRepository extends JpaRepository<Sensor, Integer> {

    // 센서 이름과 양식장 이름을 함께 비교하여 중복 검사
    @Query(value = "SELECT COUNT(*) FROM tb_sensor WHERE sensor_name = :sensor_name AND farm_name = :farm_name", nativeQuery = true)
    Long countBySensorNameAndFarmName(@Param("sensor_name") String sensor_name, @Param("farm_name") String farm_name);


    // 센서 등록 쿼리
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tb_sensor (sensor_name, sensor_type, sensor_date, sensor_model, sensor_threshold, farm_name, user_email, sensor_url) " +
                "VALUES (:sensor_name, :sensor_type, :sensor_date, :sensor_model, :sensor_threshold, :farm_name, :user_email, :sensor_url)", 
                nativeQuery = true)
    int registerSensor(
        @Param("sensor_name") String sensorName,
        @Param("sensor_type") String sensorType,
        @Param("sensor_date") java.util.Date sensorDate,  // 변경: String -> Date
        @Param("sensor_model") String sensorModel,
        @Param("sensor_threshold") BigDecimal sensorThreshold,  // 변경: Double -> BigDecimal
        @Param("farm_name") String farmName,
        @Param("user_email") String userEmail,
        @Param("sensor_url") String sensorUrl
    );

    @Query(value = "SELECT * FROM tb_sensor WHERE user_email = :user_email", nativeQuery = true)
    List<Sensor> findByUserEmail(@Param("user_email") String userEmail);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM tb_sensor WHERE sensor_id = :sensor_id", nativeQuery = true)
    int deleteSensorById(@Param("sensor_id") Integer sensor_id);

    @Query("SELECT s.sensor_url, s.sensor_id FROM Sensor s")
    List<Sensor> findAllSensorUrls();
}