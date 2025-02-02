package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_sensing")
@Data
public class Sensing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sensing_id")
    private Integer sensingId;  // 기본 키, 자동 증가

    @Column(name = "sensor_id", nullable = false)
    private Integer sensorId;  // 외래 키로 연결 가능

    @Column(name = "sensor_url", nullable = false, length = 255)
    private String sensorUrl;  // 센서 요청 URL

    @Column(name = "sensor_res", nullable = false, precision = 10, scale = 7)
    private BigDecimal sensorRes;  // 센서 응답 데이터

    @Enumerated(EnumType.STRING)
    @Column(name = "sensor_state", nullable = false)
    private SensorState sensorState = SensorState.ACTIVE;  // 센서 상태 (ACTIVE, ERROR)

    @Column(name = "sensing_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime sensingAt;  // 센서 요청 시간 (자동 생성)
    
    public enum SensorState {
        ACTIVE, 
        ERROR
    }
}

