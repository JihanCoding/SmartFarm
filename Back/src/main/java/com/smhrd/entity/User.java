package com.smhrd.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_user")
public class User {
	
	@Id
	private String user_email;

	private String user_pw;

	private String user_name;

	private String created_at;
	
	@Override
	public String toString() {
		return "User 객체";
	}
}
