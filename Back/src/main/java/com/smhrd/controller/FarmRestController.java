package com.smhrd.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.Farm;
import com.smhrd.repository.FarmRepository;


@RequestMapping("/focus/api/farm")
@RestController
public class FarmRestController {

    FarmRepository repo;


    public FarmRestController(FarmRepository repo){
        this.repo = repo;
    }
    
    @RequestMapping("add")
    public boolean addFarm(@RequestBody Farm farm) {
        int result = repo.addFarm(
            farm.getUser_email(),
            farm.getFarm_name(),
            farm.getFarm_owner(),
            farm.getFarm_tel(),
            farm.getFarm_latitude(),
            farm.getFarm_longitude()
        );
    
        if (result > 0) {
            System.out.println("양식장 등록 성공!");
            return true; 
        } else {
            System.out.println("양식장 등록 실패!");
            return false;
        }
    }

    @RequestMapping(value = "get", method = RequestMethod.POST)
    public List<Farm> getFarm(@RequestBody Farm farm) {
        System.out.println("데이터받았다: " + farm.getUser_email());
        List<Farm> result = repo.getFarm(farm.getUser_email());
    
        if (result != null && !result.isEmpty()) {
            System.out.println("양식장 조회 성공!");
            return result; 
        } else {
            System.out.println("양식장 조회 실패!");
            return Collections.emptyList();
        }
    }

    
    @RequestMapping("/delete")
    public boolean deleteFarmById(@RequestBody Farm farm) {
        int result = repo.deleteFarmById(farm.getFarm_index());
        
        return result > 0;
    }
}
