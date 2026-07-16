package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.ai.Intent;
import com.piyush.aios.ai_os.ai.IntentDetector;
import com.piyush.aios.ai_os.dto.CreateGoalRequest;
import com.piyush.aios.ai_os.dto.CreateTaskFromAIRequest;
import com.piyush.aios.ai_os.dto.dashboard.DashboardResponse;

import java.util.List;

import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.Task;

@Service
public class AIOrchestratorService {
    private final AIService aiService;
    private final IntentDetector intentDetector;
    private final GoalService goalService;
    private final GoalParserService goalParserService;
    private final TaskParserService taskParserService;
    private final TaskService taskService;
    private final DashboardService dashboardService;

    public AIOrchestratorService(
        AIService aiService,
        IntentDetector intentDetector,
        GoalService goalService, GoalParserService goalParserService,
        TaskParserService taskParserService,
        TaskService taskService,
        DashboardService dashboardService) {

        this.aiService = aiService;
        this.intentDetector = intentDetector;
        this.goalService = goalService;
        this.goalParserService = goalParserService;
        this.taskParserService = taskParserService;
        this.taskService = taskService;
        this.dashboardService = dashboardService;
    }

    public String chat(String prompt) {

        // TODO: Replace keyword-based IntentDetector with LLM-based intent detection.

        Intent intent = intentDetector.detectIntent(prompt);

        switch (intent) {

            case SHOW_GOALS:

                List<Goal> goals = goalService.getAllGoals();

                return aiService.generateGoalSummary(goals);

            case GENERAL:

                return aiService.generateResponse(prompt);

            case CREATE_GOAL:

                CreateGoalRequest goalRequest =
                        goalParserService.parse(prompt);

                Goal goal =
                        goalService.createGoal(goalRequest);

                return """
                        ✅ Goal created successfully.

                        Title: %s
                        """
                        .formatted(goal.getTitle());

            case CREATE_TASK:

                CreateTaskFromAIRequest taskRequest =
                        taskParserService.parse(prompt);

                Task task =
                        taskService.createTaskFromAI(taskRequest);

                return """
                        ✅ Task created successfully.

                        Goal : %s
                        Task : %s
                        """
                        .formatted(
                                taskRequest.getGoalTitle(),
                                task.getTitle()
                        );

            case DASHBOARD:

                DashboardResponse dashboard =
                            dashboardService.getDashboard();

                return aiService.generateDashboardSummary(
                        dashboard
                );

            default:

                return aiService.generateResponse(prompt);
        }

    }
}