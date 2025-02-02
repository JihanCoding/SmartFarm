package com.smhrd.repository;

import com.smhrd.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // private String user_email;

	// private String user_pw;

	// private String user_name;
	
	// private String user_birthdate;

	// private String user_region;

	// private String created_at;

	    // 회원가입 (INSERT)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tb_user (user_email, user_pw, user_name) " +
                   "VALUES (:user_email, SHA2(:#{#user_pw}, 512), :user_name)", nativeQuery = true)
    int registerUser(@Param("user_email") String userEmail,
                     @Param("user_pw") String userPw,
                     @Param("user_name") String userName);

    // 로그인 (SELECT)
    @Query(value = "SELECT * FROM tb_user WHERE user_email = :user_email AND user_pw = SHA2(:#{#user_pw}, 512)", nativeQuery = true)
    User loginUser(@Param("user_email") String userEmail, @Param("user_pw") String userPw);

    // 회원정보 수정 (UPDATE)
    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_user SET user_pw = SHA2(:#{#user_pw}, 512), user_name = :user_name WHERE user_email = :user_email", nativeQuery = true)
    int updateUser(@Param("user_email") String userEmail,
                   @Param("user_pw") String userPw,
                   @Param("user_name") String userName);

	// 비밀번호 수정 (UPDATE)
	@Modifying
	@Transactional
	@Query(value = "UPDATE tb_user SET user_pw = SHA2(:#{#user_pw}, 512) WHERE user_email = :user_email", nativeQuery = true)
	int chagePassword(@Param("user_email") String userEmail,
				   @Param("user_pw") String userPw);
    // 회원탈퇴 (DELETE)
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tb_user WHERE user_email = :user_email", nativeQuery = true)
    int deleteUser(@Param("user_email") String userEmail);

    // 아이디 중복체크 (SELECT)
    @Query(value = "SELECT * FROM tb_user WHERE user_email = :user_email", nativeQuery = true)
    User checkEmail(@Param("user_email") String userEmail);
}