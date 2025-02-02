package com.smhrd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.smhrd.entity.News;

@Repository
public interface NewsRepository extends JpaRepository<News, Integer> {

    // private Integer news_idx;

	// private String news_title;

	// private String news_content;

	// private String news_url;
	
	// private String news_file;

	// private String created_at;

    // 뉴스데이터 가져오기 (SELECT)
    @Query(value = "SELECT * FROM tb_news ORDER BY news_idx DESC LIMIT 30", nativeQuery = true)
    List<News> findTop3NewsByIndex();

}