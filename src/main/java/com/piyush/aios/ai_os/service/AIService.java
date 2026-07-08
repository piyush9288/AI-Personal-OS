package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;

import com.piyush.aios.ai_os.dto.gemini.GeminiResponse;
import com.piyush.aios.ai_os.dto.gemini.request.ContentRequest;
import com.piyush.aios.ai_os.dto.gemini.request.PartRequest;
import com.piyush.aios.ai_os.dto.gemini.request.GeminiRequest;
import com.piyush.aios.ai_os.entity.Chat;
import com.piyush.aios.ai_os.entity.ChatRole;

@Service
public class AIService {
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;


    private final WebClient webClient;
    private final ChatService chatService;

    public AIService(
        WebClient webClient,
        ChatService chatService) {

        this.webClient = webClient;
        this.chatService = chatService;
    }

    public String generateResponse(String prompt) {
        chatService.saveUserMessage(prompt);
        List<Chat> chats = chatService.getChatHistory();

        List<ContentRequest> contents =
                chats.stream()
                        .map(chat -> {

                        String role =
                                chat.getRole() == ChatRole.USER
                                        ? "user"
                                        : "model";

                        return new ContentRequest(
                                role,
                                List.of(
                                        new PartRequest(
                                                chat.getMessage()
                                        )
                                )
                        );

                        })
                        .toList();

        GeminiRequest request = new GeminiRequest(contents);
        GeminiResponse response =
                webClient.post()
                        .uri(apiUrl + "?key=" + apiKey)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(GeminiResponse.class)
                        .block();

        String aiResponse = response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();

        chatService.saveAIMessage(aiResponse);

        return aiResponse;
    }
}
