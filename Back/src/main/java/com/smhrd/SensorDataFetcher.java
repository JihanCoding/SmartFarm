package com.smhrd;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.smhrd.entity.Sensor;
import com.smhrd.repository.SensingRepository;
import com.smhrd.repository.SensorRepository;

import java.util.List;

@Component
public class SensorDataFetcher {

    private final SensorRepository repo;
    private final SensingRepository sensingRepo;
    private final RestTemplate restTemplate;

    public SensorDataFetcher(SensorRepository repo, RestTemplate restTemplate, SensingRepository sensingRepo) {
        this.sensingRepo = sensingRepo;
        this.repo = repo;
        this.restTemplate = restTemplate;
    }

    // 30분마다 실행 (1800000 밀리초 = 30분)
    @Scheduled(fixedRate = 1800000)
    public void fetchSensorData() {
        // List<Sensor> sensorUrls = repo.findAllSensorUrls();  // DB에서 URL 조회

        // for (Sensor sensor : sensorUrls) {
        //     try {
        //         String response = restTemplate.getForObject(sensor.getSensor_url(), String.class);
        //         System.out.println("URL: " + sensor.getSensor_url() + " 응답: " + response);
        //         // 응답을 데이터베이스에 저장하거나 추가 로직 수행
        //         // @Param("sensorId") Integer sensorId
        //         // @Param("sensorUrl") String sensorUrl
        //         // @Param("sensorRes") BigDecimal sensorRes
        //         // @Param("sensorState") String sensorState
        //         // sensingRepo.insertSensingData();
        //     } catch (Exception e) {
        //         System.err.println("URL 요청 실패: " + sensor.getSensor_url() + ", 오류: " + e.getMessage());
        //     }
        // }
    }
}