package com.piyush.aios.ai_os.ai;

import org.springframework.stereotype.Component;

import com.piyush.aios.ai_os.dto.ai.GoalExtractionResponse;
import com.piyush.aios.ai_os.service.AIService;

@Component
public class GoalExtractor {
    private final AIService aiService;

    public GoalExtractor(AIService aiService) {
        this.aiService = aiService;
    }

    public GoalExtractionResponse extract(String prompt) {

    }
}
