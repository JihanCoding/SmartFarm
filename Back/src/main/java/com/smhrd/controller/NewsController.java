package com.smhrd.controller;

import org.springframework.web.bind.annotation.RestController;
import com.smhrd.entity.News;
import com.smhrd.repository.NewsRepository;
import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/focus/api/news")
@RestController
public class NewsController {
    NewsRepository repo;

    public NewsController(NewsRepository repo){
        this.repo = repo;
    }

    @RequestMapping("/top3")
    public List<News> getTop3(){
        List<News> data = repo.findTop3NewsByIndex();
        if (data == null || data.isEmpty()) {
            return Collections.emptyList();
        }
        return data;
    }
}
