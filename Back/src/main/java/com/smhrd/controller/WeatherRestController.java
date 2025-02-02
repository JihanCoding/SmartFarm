package com.smhrd.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.Weather;
import com.smhrd.repository.WeatherRepository;

@RequestMapping("/focus/api/weather")
@RestController
public class WeatherRestController {

    WeatherRepository repo;

    public WeatherRestController(WeatherRepository repo){
        this.repo = repo;
    }
    
    
    @RequestMapping("/get")
    public List<Weather> getWeather(){
        List<Weather> data = repo.getWeather();
        if (data == null || data.isEmpty()) {
            return Collections.emptyList();
        }
        return data;
    }
}
