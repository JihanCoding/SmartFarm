package com.smhrd.entity;

import java.sql.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_farm")
public class Farm {
	
	private String user_email;

	@Id
	private Integer farm_index;

	private String farm_name;

	private String farm_owner;

	private String farm_tel;

	private Double farm_latitude;

	private Double farm_longitude;

	private Timestamp created_at;

	
	@Override
	public String toString() {
		return "Farm 객체";
	}
}
