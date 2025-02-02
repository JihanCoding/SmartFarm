package com.smhrd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.smhrd.entity.Weather;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Integer> {

	// private Integer wh_idx;

	// private String wh_icon;

	// private Double wh_curTp;

	// private Double wh_difTp;
	
	// private Double wh_flTp;

	// private Integer wh_humid;

	// private Double wh_wdSp;

	// private String created_at;

    // 날씨 데이터 가져오기 (SELECT)
    @Query(value = "SELECT * FROM tb_weather ORDER BY wh_idx DESC LIMIT 1", nativeQuery = true)
    List<Weather> getWeather();

}