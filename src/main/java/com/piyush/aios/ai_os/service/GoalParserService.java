package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateGoalRequest;

@Service
public class GoalParserService {

    public CreateGoalRequest parse(String prompt) {

        CreateGoalRequest request = new CreateGoalRequest();

        String text = prompt
                .replace("create goal", "")
                .replace("add goal", "")
                .trim();

        request.setTitle(text);

        return request;
    }

}