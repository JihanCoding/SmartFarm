package com.smhrd.controller;

import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.User;
import com.smhrd.repository.AlertRepository;
import com.smhrd.repository.SensorRepository;
import com.smhrd.repository.UserRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/focus/api/user")
public class UserRestController {
    private UserRepository user_repo;
    private SensorRepository sensor_repo;
    private AlertRepository alert_repo;


    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public void handleOptionsRequest() {
        // OPTIONS 요청을 빈 응답으로 허용
    }

    public UserRestController(UserRepository user_repo, SensorRepository sensor_repo, AlertRepository alert_repo) {
        this.user_repo = user_repo;
        this.sensor_repo = sensor_repo;
        this.alert_repo = alert_repo;
        System.out.println("유저 컨트롤러 진입");
    }

    // 로그인
    @RequestMapping("/login")
    public User login(@RequestBody Map<String, String> formData) {
        try {
            User result =  user_repo.loginUser(formData.get("email"), formData.get("pw"));
            return (result != null) ? result : null;
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
        return null;
    }
    // 회원가입
    @RequestMapping("/join")
    public String join(@RequestBody Map<String, String> formData) {
        try {
            System.err.println(formData.get("email")+"입니다.");
            user_repo.registerUser(formData.get("email"), formData.get("pw"), formData.get("firstName")+formData.get("lastName"));
            return "true"; // 저장 성공
        } catch (DataAccessException e) {
            e.printStackTrace();
            return "false"; // 저장 실패
        }
    }

    // 회원정보수정
    @RequestMapping("/update")
    public String update(@RequestBody User user) {
        try {
            user_repo.updateUser(user.getUser_email(), user.getUser_pw(), user.getUser_name());
            return "true"; // 업데이트 성공
        } catch (DataAccessException e) {
            e.printStackTrace();
            return "false"; // 업데이트 실패
        }
    }

    // 회원탈퇴
    @RequestMapping("/delete")
    public String delete(String id) {
        long sensorResult = sensor_repo.deleteSensor(id);
        long alertResult = alert_repo.deleteAlert(id);
        long userResult = user_repo.deleteUser(id);

        if (sensorResult == 0 && alertResult == 0 && userResult == 0) {
            return "false";
        } else {
            return "true";
        }
    }

    // 이메일 중복체크
    @RequestMapping("/check")
    public String checkEmail(@RequestBody Map<String, String> formData) {
        try {
            User result = user_repo.checkEmail(formData.get("email"));
            if( result == null){
                return "false";
            }
            else{
                return "true";
            }
        } catch (DataAccessException e) {
                e.printStackTrace();
        }
        return null;
    }
}