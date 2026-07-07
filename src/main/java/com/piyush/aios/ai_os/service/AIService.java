package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;

import com.piyush.aios.ai_os.dto.gemini.GeminiResponse;

@Service
public class AIService {
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;


    private final WebClient webClient;

    public AIService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String generateResponse(String prompt) {

        GeminiResponse response =
                webClient.post()
                        .uri(apiUrl + "?key=" + apiKey)
                        .bodyValue(
                                Map.of(
                                        "contents",
                                        List.of(
                                                Map.of(
                                                        "parts",
                                                        List.of(
                                                                Map.of(
                                                                        "text", prompt
                                                                )
                                                        )
                                                )
                                        )
                                )
                        )
                        .retrieve()
                        .bodyToMono(GeminiResponse.class)
                        .block();

        return response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();
    }
}
