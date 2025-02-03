package com.smhrd.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.Sensing;
import com.smhrd.entity.Sensor;
import com.smhrd.repository.SensingRepository;
import com.smhrd.repository.SensorRepository;

@RequestMapping("/focus/api/sensing")
@RestController
public class SensingRestController {

    SensingRepository repo;
    SensorRepository ss_repo;

    public SensingRestController(SensingRepository repo, SensorRepository ss_repo){
        this.repo = repo;
        this.ss_repo = ss_repo;
    }
    
    @RequestMapping("/get")
    public List<Sensing> getSensing() {
        List<Sensing> result = repo.getSensing();

        if(!result.isEmpty()){
            return result;
        }
        else{
            return null;
        }
        
    }
    
    @GetMapping("/from")
    public void getSensorData(
            @RequestParam(name = "user_email") String user_email,
            @RequestParam(name = "farm_name") String farm_name,
            @RequestParam(name = "sensor_name") String sensor_name,
            @RequestParam(name = "sensor_res") BigDecimal sensor_res
    ) {
        // sensor_res가 정수형일 경우에도 소수점 한 자리로 변환
        sensor_res = sensor_res.setScale(1, RoundingMode.HALF_UP);
    
        // 센서 ID 조회 및 데이터 삽입
        Integer sensor_id = ss_repo.findSensorId(user_email, farm_name, sensor_name);
        String sensorString = Sensing.SensorState.ACTIVE.name();
        int result = repo.insertSensingData(sensor_id, (user_email + farm_name + sensor_name + sensor_res), sensor_res, sensorString);
    
        if (result > 0) {
            System.out.println("로컬센서 INSERT 성공");
        } else {
            System.out.println("로컬센서 INSERT 실패");
        }
    }
}
