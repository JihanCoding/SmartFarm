package com.smhrd.controller;


import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.Alert;
import com.smhrd.repository.AlertRepository;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController
@RequestMapping("/focus/api/alert")
public class AlertRestController {

    private AlertRepository alert_repo;

    public AlertRestController(AlertRepository alert_repo) {
        this.alert_repo = alert_repo;
    }

    @RequestMapping("/add")
    public boolean insertAlert(@RequestBody Alert param) {
        int check = alert_repo.existsAlert(param.getSensing_at(), param.getSensor_name(), param.getFarm_name(), param.getAlert_msg());
        if (check == 0) {
            int result = alert_repo.insertAlert(param.getUser_email(), param.getAlert_msg(), param.getFarm_name(), param.getSensor_name(), param.getSensing_at());
            if (result > 0) {
                System.out.println("알람 추가 완료");
                return true;
            } else {
                System.out.println("알람 추가 실패");
            }
        } else {
            System.out.println("중복 알람으로 추가하지 않음");
        }
        return false;
    }

    @RequestMapping("/get")
    public List<Alert> findAlertsByUserEmail(@RequestBody Alert param) {
        return alert_repo.findAlertsByUserEmail(param.getUser_email());
    }

    @RequestMapping("/update")
    public boolean updateAlert(@RequestBody Alert param) {
       int result = alert_repo.updateAlert("y", param.getUser_email(), param.getFarm_name(), param.getSensor_name(), param.getAlert_msg(), param.getSensing_at());

       return result > 0;
    }
    
}