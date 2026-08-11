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

    public String chat(String prompt) {
        // Save the user message first
        chatService.saveUserMessage(prompt);

        // TODO: Replace keyword-based IntentDetector with LLM-based intent detection.
        Intent intent = intentDetector.detectIntent(prompt);
        String aiResponse = "";

        switch (intent) {
            case SHOW_GOALS:
                List<Goal> goals = goalService.getAllGoals();
                aiResponse = aiService.generateGoalSummary(goals);
                break;
                
            case DELETE_GOAL:
                try {
                    List<Goal> allGoals = goalService.getAllGoals();
                    Goal goalToDelete = null;
                    for (Goal g : allGoals) {
                        if (prompt.toLowerCase().contains(g.getTitle().toLowerCase())) {
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
                
            case SHOW_TASKS:
                List<Task> tasks = taskService.getPendingTasks();
                aiResponse = aiService.generatePendingTaskSummary(tasks);
                break;

            case GENERAL:
                // generateResponse saves internally, so we don't save twice
                return aiService.generateResponse(prompt);

            case CREATE_GOAL:
                try {
                    CreateGoalRequest goalRequest = goalParserService.parse(prompt);
                    if (goalRequest.getTitle() == null || goalRequest.getTitle().isEmpty()) {
                        aiResponse = "⚠️ Please specify a title for the goal. (e.g., 'create goal Learn Java')";
                    } else {
                        Goal goal = goalService.createGoal(goalRequest);
                        aiResponse = """
                                ✅ Goal created successfully.
    
                                Title: %s
                                """.formatted(goal.getTitle());
                    }
                } catch (Exception e) {
                    aiResponse = "⚠️ Could not create goal. Please try again with a clearer format.";
                }
                break;

            case CREATE_TASK:
                try {
                    CreateTaskFromAIRequest taskRequest = taskParserService.parse(prompt);
                    if (taskRequest.getTaskTitle() == null || taskRequest.getTaskTitle().isEmpty()) {
                        aiResponse = "⚠️ Please specify a task title. (e.g., 'create task Read Chapter 1 for goal Study')";
                    } else if (taskRequest.getGoalTitle() == null || taskRequest.getGoalTitle().isEmpty()) {
                        aiResponse = "⚠️ Please specify which goal this task belongs to. (e.g., 'for goal Study')";
                    } else {
                        Task task = taskService.createTaskFromAI(taskRequest);
                        aiResponse = """
                                ✅ Task created successfully.
    
                                Goal : %s
                                Task : %s
                                """.formatted(taskRequest.getGoalTitle(), task.getTitle());
                    }
                } catch (com.piyush.aios.ai_os.exception.GoalNotFoundException e) {
                    aiResponse = "⚠️ " + e.getMessage() + ". Please make sure the goal exists.";
                } catch (Exception e) {
                    aiResponse = "⚠️ Could not parse your task. Please try again with a clearer format like 'create task [task] for goal [goal]'.";
                }
                break;
                
            case COMPLETE_TASK:
                try {
                    List<Task> allTasks = taskService.getAllUserTasks();
                    Task taskToComplete = null;
                    for (Task t : allTasks) {
                        if (t.getStatus() != TaskStatus.COMPLETED && prompt.toLowerCase().contains(t.getTitle().toLowerCase())) {
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
                        
                        // The updateTask method internally updates goal progress. Fetch goal to check progress.
                        Goal updatedGoal = goalService.getGoalById(updatedTask.getGoal().getId());
                        
                        if (updatedGoal.getProgress() == 100) {
                            aiResponse = "🎉 Congratulations! You have completed all tasks for the goal: " + updatedGoal.getTitle() + "!\nYou've achieved 100% completion! 🎊\nIf you'd like to delete this goal now, just type 'delete goal " + updatedGoal.getTitle() + "'. Otherwise, it will be automatically removed after 2 days.";
                        } else {
                            aiResponse = "✅ Task marked as completed: " + updatedTask.getTitle() + "\nYour goal '" + updatedGoal.getTitle() + "' is now at " + updatedGoal.getProgress() + "%!";
                        }
                    } else {
                        // Fallback if no task title matched
                        aiResponse = aiService.generateResponse(prompt);
                    }
                } catch (Exception e) {
                    aiResponse = "⚠️ Could not complete task. " + e.getMessage();
                }
                break;
                
            case DELETE_TASK:
                try {
                    List<Task> allTasks = taskService.getAllUserTasks();
                    Task taskToDelete = null;
                    for (Task t : allTasks) {
                        if (prompt.toLowerCase().contains(t.getTitle().toLowerCase())) {
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

            case DASHBOARD:
                DashboardResponse dashboard = dashboardService.getDashboard();
                aiResponse = aiService.generateDashboardSummary(dashboard);
                break;

            default:
                // generateResponse saves internally
                return aiService.generateResponse(prompt);
        }
        
        // Save AI response
        chatService.saveAIMessage(aiResponse);
        return aiResponse;
    }
}