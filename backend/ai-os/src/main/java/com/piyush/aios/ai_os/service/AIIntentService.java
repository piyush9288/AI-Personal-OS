package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.piyush.aios.ai_os.ai.Intent;
import com.piyush.aios.ai_os.dto.intent.IntentResponse;

@Service
public class AIIntentService {

    private final AIService aiService;
    private final ObjectMapper objectMapper;

    public AIIntentService(
            AIService aiService,
            ObjectMapper objectMapper) {

        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    public Intent detectIntent(String prompt) {

        try {

            String systemPrompt = """
                    You are an intent classification engine.

                    Return ONLY valid JSON.

                    Example:

                    {
                      "intent":"GENERAL"
                    }

                    Possible intents:

                    GENERAL
                    CREATE_GOAL
                    SHOW_GOALS
                    UPDATE_GOAL
                    DELETE_GOAL
                    CREATE_TASK
                    SHOW_TASKS

                    User:

                    %s
                    """.formatted(prompt);

            String response = aiService.generateSimpleResponse(systemPrompt);

            IntentResponse intentResponse =
                    objectMapper.readValue(
                            response,
                            IntentResponse.class
                    );

            return intentResponse.getIntent();

        } catch (Exception e) {

            return Intent.GENERAL;

        }

    }

}