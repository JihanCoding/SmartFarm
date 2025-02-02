package com.smhrd.controller;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.Sensor;
import com.smhrd.repository.AlertRepository;
import com.smhrd.repository.SensingRepository;
import com.smhrd.repository.SensorRepository;



@RequestMapping("/focus/api/sensor")
@RestController
public class SensorRestController {

    SensorRepository repo;
    SensingRepository ss_repo;
    AlertRepository al_repo;

    public SensorRestController(SensorRepository repo, SensingRepository ss_repo, AlertRepository al_repo){
        this.repo = repo;
        this.ss_repo = ss_repo;
        this.al_repo = al_repo;
    }
    
    @RequestMapping("/check")
    public boolean checkDuplicateSensorName(@RequestBody Sensor sensor) {
        Long count = repo.countBySensorNameAndFarmName(sensor.getSensor_name(), sensor.getFarm_name());
        return count > 0;
    }
    
    @RequestMapping("/register")
    public boolean registerSensor(@RequestBody Sensor sensor) {
        System.out.println(sensor.getFarm_name());
        System.out.println("레지스터들어옴");
        try {
            // Date를 적절한 형식으로 변환
            SimpleDateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH);
            java.util.Date parsedDate = dateFormat.parse(sensor.getSensor_date().toString());
            // BigDecimal 변환
            BigDecimal threshold = sensor.getSensor_threshold();
            int result = repo.registerSensor(
                sensor.getSensor_name(),
                sensor.getSensor_type().toString(),
                parsedDate,
                sensor.getSensor_model(),
                threshold,
                sensor.getFarm_name(),
                sensor.getUser_email(),
                sensor.getSensor_url()
            );
            System.out.println("결과값"+result);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();  // 예외의 전체 스택 트레이스를 출력
            return false;
        }
    }

    @RequestMapping("/select")
    public List<Sensor> findByUserEmail(@RequestBody Sensor sensor) {
        List<Sensor> result = repo.findByUserEmail(sensor.getUser_email());

        if(!result.isEmpty()){
            return result;
        }
        else{
            return null;
        }
        
    }

    @RequestMapping("/delete")
    public boolean deleteSensorById(@RequestBody Sensor sensor) {
        boolean isSensorDeleted = false;
        boolean isSensingDataDeleted = true;  // 센서 데이터가 없어도 성공으로 간주
        boolean isAlertDeleted = true;        // 알림 데이터가 없어도 성공으로 간주
    
        try {
            // 1. 센서 삭제
            int sensorResult = repo.deleteSensorById(sensor.getSensor_id());
            isSensorDeleted = sensorResult > 0;
    
            // 2. 센서 데이터 삭제 (데이터가 없으면 0을 반환할 수 있으므로 true로 유지)
            int sensingResult = ss_repo.deleteSensingData(sensor.getSensor_id());
            if (sensingResult < 0) {  // 예외적인 경우(음수 반환 등)만 실패로 간주
                isSensingDataDeleted = false;
            }
    
            // 3. 알림 데이터 삭제 (데이터가 없으면 0을 반환할 수 있으므로 true로 유지)
            int alertResult = al_repo.deleteAlert(sensor.getUser_email(), sensor.getFarm_name(), sensor.getSensor_name());
            if (alertResult < 0) {  // 예외적인 경우만 실패로 간주
                isAlertDeleted = false;
            }
            System.out.println("alertResult"+alertResult);
    
        } catch (Exception e) {
            // 예외 발생 시 로그 출력
            System.err.println("삭제 작업 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return false;  // 예외 발생 시 즉시 false 반환
        }
    
        // ✅ 센서 삭제는 필수, 나머지는 데이터가 없어도 성공으로 간주
        boolean finalResult = isSensorDeleted && isSensingDataDeleted && isAlertDeleted;
    
        // 로그 출력 (디버깅용)
        System.out.println("삭제 결과 - 센서: " + isSensorDeleted + ", 센서 데이터: " + isSensingDataDeleted + ", 알림: " + isAlertDeleted);
    
        return finalResult;
    }
    
    
}
