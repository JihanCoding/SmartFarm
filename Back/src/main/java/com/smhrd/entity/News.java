package com.smhrd.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_alert")
public class News {
	
	@Id
	private Integer news_idx;

	private String news_title;

	private String news_content;

	private String news_url;
	
	private String news_file;

	private String created_at;

	@Override
	public String toString() {
		return "News 객체";
	}
}
