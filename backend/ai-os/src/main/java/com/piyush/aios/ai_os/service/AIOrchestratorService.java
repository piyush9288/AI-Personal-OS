package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.ai.Intent;
import com.piyush.aios.ai_os.ai.IntentDetector;
import com.piyush.aios.ai_os.dto.CreateGoalRequest;
import com.piyush.aios.ai_os.dto.CreateTaskFromAIRequest;
import com.piyush.aios.ai_os.dto.dashboard.DashboardResponse;

import java.util.List;

import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.GoalStatus;
import com.piyush.aios.ai_os.entity.Task;
import com.piyush.aios.ai_os.entity.TaskStatus;
import com.piyush.aios.ai_os.dto.UpdateTaskRequest;

@Service
public class AIOrchestratorService {
    private final AIService aiService;
    private final IntentDetector intentDetector;
    private final GoalService goalService;
    private final GoalParserService goalParserService;
    private final TaskParserService taskParserService;
    private final TaskService taskService;
    private final DashboardService dashboardService;

    private final ChatService chatService;

    public AIOrchestratorService(
        AIService aiService,
        IntentDetector intentDetector,
        GoalService goalService, GoalParserService goalParserService,
        TaskParserService taskParserService,
        TaskService taskService,
        DashboardService dashboardService,
        ChatService chatService) {

        this.aiService = aiService;
        this.intentDetector = intentDetector;
        this.goalService = goalService;
        this.goalParserService = goalParserService;
        this.taskParserService = taskParserService;
        this.taskService = taskService;
        this.dashboardService = dashboardService;
        this.chatService = chatService;
    }

    public String chat(com.piyush.aios.ai_os.dto.ChatRequest chatRequest) {
        try {
            String prompt = chatRequest.getPrompt();
            chatService.saveUserMessage(prompt);
    
            // Use the LLM for smart intent detection!
            com.piyush.aios.ai_os.dto.SmartIntentResponse smartResponse = aiService.detectSmartIntent(prompt);
            String aiResponse = "";
    
            switch (smartResponse.getIntent()) {
                case "SHOW_GOALS":
                    List<Goal> goals = goalService.getAllGoals();
                    aiResponse = aiService.generateGoalSummary(goals);
                    break;
                    
                case "DELETE_GOAL":
                    try {
                        List<Goal> allGoals = goalService.getAllGoals();
                        Goal goalToDelete = null;
                        for (Goal g : allGoals) {
                            if (smartResponse.getTitle() != null && 
                               (g.getTitle().toLowerCase().contains(smartResponse.getTitle().toLowerCase()) || 
                                smartResponse.getTitle().toLowerCase().contains(g.getTitle().toLowerCase()))) {
                                goalToDelete = g;
                                break;
                            }
                        }
                        if (goalToDelete != null) {
                            goalService.deleteGoal(goalToDelete.getId());
                            aiResponse = "🗑️ Goal successfully deleted: " + goalToDelete.getTitle();
                        } else {
                            aiResponse = "⚠️ Could not find a goal with that name to delete.";
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Error deleting goal: " + e.getMessage();
                    }
                    break;
                    
                case "SHOW_TASKS":
                    List<Task> tasks = taskService.getPendingTasks();
                    aiResponse = aiService.generatePendingTaskSummary(tasks);
                    break;
    
                case "CREATE_GOAL":
                    try {
                        if (smartResponse.getTitle() == null || smartResponse.getTitle().isEmpty()) {
                            aiResponse = "⚠️ Please specify a title for the goal.";
                        } else {
                            CreateGoalRequest goalReq = new CreateGoalRequest();
                            goalReq.setTitle(smartResponse.getTitle());
                            Goal goal = goalService.createGoal(goalReq);
                            aiResponse = "✅ Goal created successfully.\n\nTitle: " + goal.getTitle();
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not create goal. Please try again.";
                    }
                    break;
    
                case "CREATE_TASK":
                    try {
                        if (smartResponse.getTaskTitle() == null || smartResponse.getTaskTitle().isEmpty()) {
                            aiResponse = "⚠️ Please specify a task title.";
                        } else if (smartResponse.getGoalTitle() == null || smartResponse.getGoalTitle().isEmpty()) {
                            aiResponse = "⚠️ Please specify which goal this task belongs to.";
                        } else {
                            CreateTaskFromAIRequest taskReq = new CreateTaskFromAIRequest();
                            taskReq.setGoalTitle(smartResponse.getGoalTitle());
                            taskReq.setTaskTitle(smartResponse.getTaskTitle());
                            Task task = taskService.createTaskFromAI(taskReq);
                            aiResponse = "✅ Task created successfully.\n\nGoal: " + smartResponse.getGoalTitle() + "\nTask: " + task.getTitle();
                        }
                    } catch (com.piyush.aios.ai_os.exception.GoalNotFoundException e) {
                        aiResponse = "⚠️ " + e.getMessage() + ". Please make sure the goal exists.";
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not parse your task. Please try again.";
                    }
                    break;
                    
                case "COMPLETE_TASK":
                    try {
                        List<Task> allTasks = taskService.getAllUserTasks();
                        Task taskToComplete = null;
                        for (Task t : allTasks) {
                            if (t.getStatus() != TaskStatus.COMPLETED && smartResponse.getTaskTitle() != null && 
                               (t.getTitle().toLowerCase().contains(smartResponse.getTaskTitle().toLowerCase()) ||
                                smartResponse.getTaskTitle().toLowerCase().contains(t.getTitle().toLowerCase()))) {
                                taskToComplete = t;
                                break;
                            }
                        }
                        
                        if (taskToComplete != null) {
                            UpdateTaskRequest update = new UpdateTaskRequest();
                            update.setTitle(taskToComplete.getTitle());
                            update.setDescription(taskToComplete.getDescription());
                            update.setDueDate(taskToComplete.getDueDate());
                            update.setPriority(taskToComplete.getPriority());
                            update.setStatus(TaskStatus.COMPLETED);
                            
                            Task updatedTask = taskService.updateTask(taskToComplete.getId(), update);
                            Goal updatedGoal = goalService.getGoalById(updatedTask.getGoal().getId());
                            
                            if (updatedGoal.getProgress() == 100) {
                                aiResponse = "🎉 Congratulations! You have completed all tasks for the goal: " + updatedGoal.getTitle() + "!\nYou've achieved 100% completion! 🎊\nIf you'd like to delete this goal now, just type 'delete goal " + updatedGoal.getTitle() + "'. Otherwise, it will be automatically removed after 2 days.";
                            } else {
                                aiResponse = "✅ Task marked as completed: " + updatedTask.getTitle() + "\nYour goal '" + updatedGoal.getTitle() + "' is now at " + updatedGoal.getProgress() + "%!";
                            }
                        } else {
                            // Fallback if no task title matched
                            aiResponse = "⚠️ Could not find an incomplete task matching: " + smartResponse.getTaskTitle();
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not complete task. " + e.getMessage();
                    }
                    break;
                    
                case "DELETE_TASK":
                    try {
                        List<Task> allTasks = taskService.getAllUserTasks();
                        Task taskToDelete = null;
                        for (Task t : allTasks) {
                            if (smartResponse.getTaskTitle() != null && 
                               (t.getTitle().toLowerCase().contains(smartResponse.getTaskTitle().toLowerCase()) ||
                                smartResponse.getTaskTitle().toLowerCase().contains(t.getTitle().toLowerCase()))) {
                                taskToDelete = t;
                                break;
                            }
                        }
                        if (taskToDelete != null) {
                            taskService.deleteTask(taskToDelete.getId());
                            aiResponse = "🗑️ Task successfully deleted: " + taskToDelete.getTitle();
                        } else {
                            aiResponse = "⚠️ Could not find a task with that name to delete.";
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Error deleting task: " + e.getMessage();
                    }
                    break;
    
                case "DASHBOARD":
                    DashboardResponse dashboard = dashboardService.getDashboard();
                    aiResponse = aiService.generateDashboardSummary(dashboard);
                    break;
    
                case "GENERAL":
                default:
                    if (smartResponse.getAiResponse() != null && !smartResponse.getAiResponse().isEmpty()) {
                        aiResponse = smartResponse.getAiResponse();
                    } else {
                        return aiService.generateResponse(chatRequest);
                    }
                    break;
            }
            
            // Save AI response
            chatService.saveAIMessage(aiResponse);
            return aiResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ A critical backend error occurred: " + e.getMessage() + " (Type: " + e.getClass().getSimpleName() + ")";
        }
    }
}