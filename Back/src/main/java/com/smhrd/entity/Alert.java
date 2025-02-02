package com.smhrd.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_alert")
public class Alert {
	
	@Id
	private Integer alert_idx;

	private String user_email;

	private String alert_msg;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")  // 밀리초와 시간대 포함
	private LocalDateTime alerted_at;

	private String received_yn;

	private String farm_name;

	private String sensor_name;

	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")  // 밀리초와 시간대 포함
	private LocalDateTime sensing_at;

	@Override
	public String toString() {
		return "Alert 객체";
	}
}
