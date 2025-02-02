package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "tb_sensor")
@Data
public class Sensor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sensor_id")
    private Integer sensor_id;

    @Column(name = "sensor_name", nullable = false, length = 255)
    private String sensor_name;

    @Enumerated(EnumType.STRING)
    @Column(name = "sensor_type", nullable = false)
    private SensorType sensor_type;

    @Column(name = "sensor_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date sensor_date;

    @Column(name = "sensor_model", nullable = false, length = 255)
    private String sensor_model;

    @Column(name = "sensor_threshold", nullable = false, precision = 10, scale = 6)
    private BigDecimal sensor_threshold;

    @Column(name = "farm_name", nullable = false, length = 255)
    private String farm_name;

    @Column(name = "user_email", nullable = false, length = 255)
    private String user_email;

    @Column(name = "sensor_url", nullable = false, length = 255)
    private String sensor_url;
    
    public enum SensorType {
        temperature, wtr_temperature, humidity
    }
}

