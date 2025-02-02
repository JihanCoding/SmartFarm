package com.smhrd.controller;

import org.springframework.web.bind.annotation.RestController;
import com.smhrd.entity.PastData;
import com.smhrd.repository.PastDataRepository;

import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/focus/api/past")
@RestController
public class PastDataRestController {
    PastDataRepository repo;

    public PastDataRestController(PastDataRepository repo){
        this.repo = repo;
    }

    @RequestMapping("/today")
    public List<PastData> getToday(){
        List<PastData> data = repo.findDataByCurrentMonthDaySortedByYearNative();
        if (data == null || data.isEmpty()) {
            return Collections.emptyList();
        }
        return data;
    }

    @RequestMapping("/three")
    public List<PastData> getThreeDays(){
        List<PastData> data = repo.findLatestThreeDaysData();
        if (data == null || data.isEmpty()) {
            System.out.println("ㅈ데ㅑ훔네ㅏㅇㅎㅁㄴ;이ㅏ흠ㄴ;으헤재ㅡㅎㅁㄴ;ㅣ르ㅠ ㅁ;ㄴㄹ");
            return Collections.emptyList();
        }
        return data;
    }
}
