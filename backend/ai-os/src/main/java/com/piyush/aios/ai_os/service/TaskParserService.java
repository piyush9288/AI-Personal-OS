package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateTaskFromAIRequest;

@Service
public class TaskParserService {

    public CreateTaskFromAIRequest parse(String prompt) {

        CreateTaskFromAIRequest request =
                new CreateTaskFromAIRequest();

        String text = prompt.trim();

        text = text.replaceFirst("(?i)create (my )?task(s)?", "").trim();

        String[] parts = text.split("(?i)\\s+(?:for|on|in)(?:\\s+this)?\\s+goal(?:s)?\\s+");

        if (parts.length == 1) {
            // Also try splitting on "for" or "on" if the word "goal" is omitted
            parts = text.split("(?i)\\s+(?:for|on)\\s+");
        }

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