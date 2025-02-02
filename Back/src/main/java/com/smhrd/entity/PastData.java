package com.smhrd.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_env_data")
public class PastData {
	
	@Id
	private Integer env_idx;

	private String op_name;

	private String observed_at;
	
	private Double avg_temp;

	private Double high_temp;

	private Double low_temp;

	private Double mean_temp;

	private Double env_std;

	@Override
	public String toString() {
		return "PastData 객체";
	}
}
