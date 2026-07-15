package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.ai.Intent;
import com.piyush.aios.ai_os.ai.IntentDetector;

import java.util.List;

import com.piyush.aios.ai_os.entity.Goal;

@Service
public class AIOrchestratorService {
    private final AIService aiService;
    private final IntentDetector intentDetector;
    private final GoalService goalService;

    public AIOrchestratorService(
        AIService aiService,
        IntentDetector intentDetector,
        GoalService goalService) {

        this.aiService = aiService;
        this.intentDetector = intentDetector;
        this.goalService = goalService;
    }

    public String chat(String prompt) {

        Intent intent = intentDetector.detectIntent(prompt);

        switch (intent) {

            case SHOW_GOALS:

                List<Goal> goals = goalService.getAllGoals();

                return aiService.generateGoalSummary(goals);

            case GENERAL:

                return aiService.generateResponse(prompt);

            default:

                return "Unsupported intent.";

        }

    }
}