package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

@Service
public class AIOrchestratorService {
    private final AIService aiService;
    private final ChatService chatService;

    public AIOrchestratorService(
        AIService aiService,
        ChatService chatService) {

        this.aiService = aiService;
        this.chatService = chatService;
    }

    public String chat(String prompt) {

        return aiService.generateResponse(prompt);

    }
}