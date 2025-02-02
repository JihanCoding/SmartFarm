package com.smhrd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smhrd.entity.LiveData;

@Repository
public interface LiveDataRepository extends JpaRepository<LiveData, Integer> {
    // private Integer risa_idx;

	// private String op_name;

	// private String observed_at;
	
	// private Double water_temp;
    @Query(value = "SELECT * FROM tb_risa WHERE op_name = :opName ORDER BY observed_at DESC", nativeQuery = true)
    List<LiveData> getLiveData(@Param("opName") String opName);
}