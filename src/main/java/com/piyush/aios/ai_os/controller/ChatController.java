package com.piyush.aios.ai_os.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.piyush.aios.ai_os.dto.ChatRequest;
import com.piyush.aios.ai_os.service.AIOrchestratorService;
import com.piyush.aios.ai_os.service.AIService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ai")
public class ChatController {
    private final AIOrchestratorService aiOrchestratorService;

    public ChatController(AIOrchestratorService aiOrchestratorService) {
        this.aiOrchestratorService = aiOrchestratorService;
    }

    @PostMapping("/chat")
    public String chat(@Valid @RequestBody ChatRequest request) {

        return aiOrchestratorService.chat(request.getPrompt());

    }
}