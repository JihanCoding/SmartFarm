package com.smhrd.controller;

import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.LiveData;
import com.smhrd.repository.LiveDataRepository;

import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/focus/api/live")
@RestController
public class LiveDataRestController {
    LiveDataRepository repo;

    public LiveDataRestController(LiveDataRepository repo){
        this.repo = repo;
    }

    @RequestMapping("/get")
    public List<LiveData> getLiveData(){
        List<LiveData> liveDataList = repo.getLiveData("완도 가교");
        if (liveDataList == null || liveDataList.isEmpty()) {
            return Collections.emptyList();
        }
        return liveDataList;
    }
}
