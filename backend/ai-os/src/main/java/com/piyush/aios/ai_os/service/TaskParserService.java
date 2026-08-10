package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateTaskFromAIRequest;

@Service
public class TaskParserService {

    public CreateTaskFromAIRequest parse(String prompt) {

        CreateTaskFromAIRequest request =
                new CreateTaskFromAIRequest();

        String text = prompt.trim();

        text = text.replaceFirst("(?i)create task", "").trim();

        String[] parts = text.split("(?i)for goal");

        request.setTaskTitle(parts[0].trim());

        if(parts.length > 1){

            request.setGoalTitle(parts[1].trim());

        }else{

            throw new IllegalArgumentException(
                    "Please specify the goal."
            );

        }

        return request;
    }
}