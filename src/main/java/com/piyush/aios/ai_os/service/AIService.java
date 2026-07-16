package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;

import com.piyush.aios.ai_os.dto.dashboard.DashboardResponse;
import com.piyush.aios.ai_os.dto.gemini.GeminiResponse;
import com.piyush.aios.ai_os.dto.gemini.request.ContentRequest;
import com.piyush.aios.ai_os.dto.gemini.request.PartRequest;
import com.piyush.aios.ai_os.dto.gemini.request.GeminiRequest;
import com.piyush.aios.ai_os.entity.Chat;
import com.piyush.aios.ai_os.entity.ChatRole;
import com.piyush.aios.ai_os.entity.Goal;



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

    public String generateGoalSummary(List<Goal> goals) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are AI Personal OS.

                The user has the following goals:

                """);

        for (Goal goal : goals) {

                prompt.append("- ")
                        .append(goal.getTitle())
                        .append("\n");

        }

        prompt.append("""

                Summarize these goals in a friendly and motivating way.
                """);

        GeminiRequest request = createRequest(prompt.toString());

        return callGemini(request);
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
        String aiResponse = callGemini(request);

        chatService.saveAIMessage(aiResponse);

        return aiResponse;
    }

    private GeminiRequest createRequest(String prompt) {

        PartRequest part = new PartRequest(prompt);

        ContentRequest content = new ContentRequest(
                "user",
                List.of(part)
        );

        return new GeminiRequest(
                List.of(content)
        );
    }

    private String callGemini(GeminiRequest request) {


        GeminiResponse response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();

        if (response == null) {
                throw new RuntimeException("Gemini returned null response");
        }

        return response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();
        }

        public String generateSimpleResponse(String prompt) {

                GeminiRequest request = createRequest(prompt);

                return callGemini(request);

        }

        public String generateDashboardSummary(DashboardResponse dashboard) {

                String prompt = """
                        You are AI Personal OS.

                        Analyze the dashboard statistics.

                        Total Goals : %d

                        Completed Goals : %d

                        Total Tasks : %d

                        Completed Tasks : %d

                        Pending Tasks : %d

                        Overall Progress : %d%%

                        Give:

                        1. Progress Summary

                        2. Motivation

                        3. Next Recommendation

                        Keep the answer under 150 words.
                        """
                        .formatted(
                                dashboard.getTotalGoals(),
                                dashboard.getCompletedGoals(),
                                dashboard.getTotalTasks(),
                                dashboard.getCompletedTasks(),
                                dashboard.getPendingTasks(),
                                dashboard.getOverallProgress()
                        );

                GeminiRequest request = createRequest(prompt);

                return callGemini(request);

        }
}
