package com.smhrd.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_pred_data")
public class PredictData {
	
	@Id
	private Integer pred_idx;

	private String op_name;

	private Double pred_temp;
	
	private String predicted_at;

	@Override
	public String toString() {
		return "PredictData 객체";
	}
}
