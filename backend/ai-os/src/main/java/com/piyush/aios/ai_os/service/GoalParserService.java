package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateGoalRequest;

@Service
public class GoalParserService {

    public CreateGoalRequest parse(String prompt) {

        CreateGoalRequest request = new CreateGoalRequest();
        String text = prompt.trim();

        text = text.replaceFirst("(?i)create (my )?goal(s)?(\\.)?", "").trim();
        text = text.replaceFirst("(?i)add (my )?goal(s)?(\\.)?", "").trim();
        text = text.replaceFirst("(?i)my goal(s)? is", "").trim();
        text = text.replaceFirst("^[:.\\-\\s]+", "").trim();

        request.setTitle(text);

        return request;
    }

}