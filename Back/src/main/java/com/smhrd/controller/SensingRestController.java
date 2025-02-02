package com.smhrd.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.Sensing;
import com.smhrd.repository.SensingRepository;

@RequestMapping("/focus/api/sensing")
@RestController
public class SensingRestController {

    SensingRepository repo;

    public SensingRestController(SensingRepository repo){
        this.repo = repo;
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
}
