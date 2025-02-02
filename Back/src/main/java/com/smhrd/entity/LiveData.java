package com.smhrd.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_risa")
public class LiveData {
	
	@Id
	private Integer risa_idx;

	private String op_name;

	private String observed_at;
	
	private Double water_temp;

	@Override
	public String toString() {
		return "LiveData 객체";
	}
}
