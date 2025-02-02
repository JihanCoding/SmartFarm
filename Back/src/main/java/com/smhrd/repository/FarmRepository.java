package com.smhrd.repository;

import com.smhrd.entity.Farm;
import com.smhrd.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface FarmRepository extends JpaRepository<User, String> {

    // private String user_email;

    // @Id
    // private Integer farm_index;

    // private String farm_name;

    // private String farm_owner;

    // private String farm_tel;

    // private Double farm_latitude;

    // private Double farm_longitude;

    // private String created_at;

    // 양식장 추가 (INSERT)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tb_farm (user_email, farm_name, farm_owner, farm_tel, farm_latitude, farm_longitude) " +
            "VALUES (:user_email, :farm_name, :farm_owner, :farm_tel, :farm_latitude, :farm_longitude)", nativeQuery = true)
    int addFarm(@Param("user_email") String user_email,
            @Param("farm_name") String farm_name,
            @Param("farm_owner") String farm_owner,
            @Param("farm_tel") String farm_tel,
            @Param("farm_latitude") Double farm_latitude,
            @Param("farm_longitude") Double farm_longitude);

    @Query("SELECT f FROM Farm f WHERE f.user_email = :user_email")
    List<Farm> getFarm(@Param("user_email") String user_email);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM tb_farm WHERE farm_index = :farm_index", nativeQuery = true)
    int deleteFarmById(@Param("farm_index") Integer farm_index);

}