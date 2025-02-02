package com.smhrd.repository;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.smhrd.entity.Alert;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Integer> {
    // ✅ 같은 sensing_at, sensor_name, farm_name이 존재하는지 확인 (COUNT 사용)
    @Query(value = "SELECT COUNT(*) FROM tb_alert WHERE alert_msg = :alert_msg AND sensing_at = :sensing_at AND sensor_name = :sensor_name AND farm_name = :farm_name", nativeQuery = true)
    int existsAlert(@Param("sensing_at") LocalDateTime sensing_at, @Param("sensor_name") String sensor_name, @Param("farm_name") String farm_name, @Param("alert_msg") String alert_msg);

    // ✅ 새로운 알람 추가 (INSERT)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tb_alert (user_email, alert_msg, farm_name, sensor_name, sensing_at) VALUES (:user_email, :alert_msg, :farm_name, :sensor_name, :sensing_at)", nativeQuery = true)
    int insertAlert(@Param("user_email") String user_email, @Param("alert_msg") String alert_msg, @Param("farm_name") String farm_name, @Param("sensor_name") String sensor_name, @Param("sensing_at") LocalDateTime sensing_at);

    // ✅ 양식장 별 내 알람 가져오기
    @Query(value = "SELECT * FROM tb_alert WHERE user_email = :user_email ORDER BY alerted_at DESC", nativeQuery = true)
    List<Alert> findAlertsByUserEmail(@Param("user_email") String user_email);
    
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM tb_alert WHERE user_email = :user_email AND farm_name = :farm_name AND sensor_name = :sensor_name", nativeQuery = true)
    int deleteAlert(@Param("user_email") String user_email,
                    @Param("farm_name") String farm_name,
                    @Param("sensor_name") String sensor_name);


     @Transactional
     @Modifying
     @Query(value = "UPDATE tb_alert " +
                    "SET received_yn = :received_yn WHERE user_email = :user_email AND farm_name = :farm_name AND sensor_name = :sensor_name AND alert_msg = :alert_msg AND sensing_at = :sensing_at", 
            nativeQuery = true)
     int updateAlert(@Param("received_yn") String received_yn,
                     @Param("user_email") String user_email,
                     @Param("farm_name") String farm_name,
                     @Param("sensor_name") String sensor_name,
                     @Param("alert_msg") String alert_msg,
                     @Param("sensing_at") LocalDateTime sensing_at);
}