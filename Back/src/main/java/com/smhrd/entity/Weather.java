package com.smhrd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_weather")
public class Weather {
	
	@Id
	private Integer wh_idx;

	private String wh_icon;

	@Column(name = "wh_curTp")
	private Double wh_curTp;

	private Double wh_difTp;
	
	private Double wh_flTp;

	private Integer wh_humid;

	private Double wh_wdSp;

	private String created_at;

	@Override
	public String toString() {
		return "날씨 객체";
	}
}
