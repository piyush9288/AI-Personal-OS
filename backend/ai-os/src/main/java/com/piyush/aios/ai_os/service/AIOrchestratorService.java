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
                            aiResponse = "✅ Goal created successfully: **" + goal.getTitle() + "**\n\nWould you like me to auto-generate tasks for this goal? If yes, tell me how many! (e.g., 'Generate 3 tasks for " + goal.getTitle() + "' or 'Generate all possible tasks')";
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not create goal. Please try again.";
                    }
                    break;
                    
                case "AUTO_GENERATE_TASKS":
                    try {
                        if (smartResponse.getGoalTitle() == null || smartResponse.getGoalTitle().isEmpty()) {
                            aiResponse = "⚠️ Please specify which goal you want me to generate tasks for.";
                        } else {
                            // Find the goal
                            List<Goal> allGoals = goalService.getAllGoals();
                            Goal targetGoal = null;
                            for (Goal g : allGoals) {
                                if (g.getTitle().toLowerCase().contains(smartResponse.getGoalTitle().toLowerCase()) ||
                                    smartResponse.getGoalTitle().toLowerCase().contains(g.getTitle().toLowerCase())) {
                                    targetGoal = g;
                                    break;
                                }
                            }
                            
                            if (targetGoal != null) {
                                List<String> generatedTasks = aiService.generateTasksForGoal(targetGoal.getTitle(), smartResponse.getCount());
                                StringBuilder sb = new StringBuilder("✅ I have auto-generated " + generatedTasks.size() + " tasks for **" + targetGoal.getTitle() + "**:\n\n");
                                for (String t : generatedTasks) {
                                    CreateTaskFromAIRequest tr = new CreateTaskFromAIRequest();
                                    tr.setGoalTitle(targetGoal.getTitle());
                                    tr.setTaskTitle(t);
                                    taskService.createTaskFromAI(tr);
                                    sb.append("- ").append(t).append("\n");
                                }
                                sb.append("\nDo you want to complete them yourself, or should I help you learn and complete them step-by-step? (Say: 'Help me complete my tasks')");
                                aiResponse = sb.toString();
                            } else {
                                aiResponse = "⚠️ Could not find a goal matching: " + smartResponse.getGoalTitle();
                            }
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Error generating tasks: " + e.getMessage();
                    }
                    break;
                    
                case "START_TUTORING":
                    aiResponse = "Great! I will help you complete your tasks step-by-step. Let's start with your pending tasks. Whenever you finish a step or task, just tell me (e.g., 'mark task X as done'), and I'll track your progress!\n\nWhat do you want to work on first?";
                    break;
    
                case "CREATE_TASK":
                    try {
                        if (smartResponse.getGoalTitle() == null || smartResponse.getGoalTitle().isEmpty()) {
                            aiResponse = "⚠️ Please specify which goal this task belongs to.";
                        } else if (smartResponse.getTaskTitles() != null && !smartResponse.getTaskTitles().isEmpty()) {
                            StringBuilder sb = new StringBuilder("✅ Tasks created successfully for **" + smartResponse.getGoalTitle() + "**:\n");
                            for (String tt : smartResponse.getTaskTitles()) {
                                CreateTaskFromAIRequest taskReq = new CreateTaskFromAIRequest();
                                taskReq.setGoalTitle(smartResponse.getGoalTitle());
                                taskReq.setTaskTitle(tt);
                                Task task = taskService.createTaskFromAI(taskReq);
                                sb.append("- ").append(task.getTitle()).append("\n");
                            }
                            aiResponse = sb.toString();
                        } else if (smartResponse.getTaskTitle() != null && !smartResponse.getTaskTitle().isEmpty()) {
                            CreateTaskFromAIRequest taskReq = new CreateTaskFromAIRequest();
                            taskReq.setGoalTitle(smartResponse.getGoalTitle());
                            taskReq.setTaskTitle(smartResponse.getTaskTitle());
                            Task task = taskService.createTaskFromAI(taskReq);
                            aiResponse = "✅ Task created successfully.\n\nGoal: " + smartResponse.getGoalTitle() + "\nTask: " + task.getTitle();
                        } else {
                            aiResponse = "⚠️ Please specify a task title.";
                        }
                    } catch (com.piyush.aios.ai_os.exception.GoalNotFoundException e) {
                        aiResponse = "⚠️ " + e.getMessage() + ". Please make sure the goal exists.";
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not parse your task. Please try again.";
                    }
                    break;
                    
                case "COMPLETE_ALL_TASKS":
                    try {
                        List<Task> pendingTasks = taskService.getPendingTasks();
                        if (pendingTasks.isEmpty()) {
                            aiResponse = "🎉 You don't have any pending tasks to complete!";
                        } else {
                            for (Task t : pendingTasks) {
                                UpdateTaskRequest update = new UpdateTaskRequest();
                                update.setTitle(t.getTitle());
                                update.setDescription(t.getDescription());
                                update.setDueDate(t.getDueDate());
                                update.setPriority(t.getPriority());
                                update.setStatus(TaskStatus.COMPLETED);
                                taskService.updateTask(t.getId(), update);
                            }
                            aiResponse = "🎉 Awesome! I have marked ALL your pending tasks (" + pendingTasks.size() + ") as completed. Excellent work!";
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not complete all tasks. " + e.getMessage();
                    }
                    break;
                    
                case "COMPLETE_TASK":
                    try {
                        List<Task> allTasks = taskService.getAllUserTasks();
                        java.util.List<Task> tasksToComplete = new java.util.ArrayList<>();
                        
                        if (smartResponse.getTaskTitles() != null && !smartResponse.getTaskTitles().isEmpty()) {
                            for (String tt : smartResponse.getTaskTitles()) {
                                for (Task t : allTasks) {
                                    if (t.getStatus() != TaskStatus.COMPLETED && 
                                       (t.getTitle().toLowerCase().contains(tt.toLowerCase()) ||
                                        tt.toLowerCase().contains(t.getTitle().toLowerCase()))) {
                                        tasksToComplete.add(t);
                                        break; // Only match one per title
                                    }
                                }
                            }
                        } else if (smartResponse.getCount() != null && smartResponse.getCount() > 0) {
                            List<Task> pending = taskService.getPendingTasks();
                            for (int i = 0; i < Math.min(smartResponse.getCount(), pending.size()); i++) {
                                tasksToComplete.add(pending.get(i));
                            }
                        } else if (smartResponse.getTaskTitle() != null) {
                            for (Task t : allTasks) {
                                if (t.getStatus() != TaskStatus.COMPLETED && 
                                   (t.getTitle().toLowerCase().contains(smartResponse.getTaskTitle().toLowerCase()) ||
                                    smartResponse.getTaskTitle().toLowerCase().contains(t.getTitle().toLowerCase()))) {
                                    tasksToComplete.add(t);
                                    break;
                                }
                            }
                        }
                        
                        if (!tasksToComplete.isEmpty()) {
                            StringBuilder sb = new StringBuilder("✅ Completed the following tasks:\n");
                            Goal updatedGoal = null;
                            for (Task tToComplete : tasksToComplete) {
                                UpdateTaskRequest update = new UpdateTaskRequest();
                                update.setTitle(tToComplete.getTitle());
                                update.setDescription(tToComplete.getDescription());
                                update.setDueDate(tToComplete.getDueDate());
                                update.setPriority(tToComplete.getPriority());
                                update.setStatus(TaskStatus.COMPLETED);
                                
                                Task updatedTask = taskService.updateTask(tToComplete.getId(), update);
                                updatedGoal = goalService.getGoalById(updatedTask.getGoal().getId());
                                sb.append("- ").append(updatedTask.getTitle()).append("\n");
                            }
                            
                            if (updatedGoal != null && updatedGoal.getProgress() == 100) {
                                aiResponse = sb.toString() + "\n🎉 Congratulations! You have completed all tasks for the goal: **" + updatedGoal.getTitle() + "**!\nYou've achieved 100% completion! 🎊\n\nWould you like me to delete this completed goal now? If you say 'no', I will automatically clean it up in 2 days.";
                            } else if (updatedGoal != null) {
                                aiResponse = sb.toString() + "\nYour goal '" + updatedGoal.getTitle() + "' is now at " + updatedGoal.getProgress() + "%!";
                            } else {
                                aiResponse = sb.toString();
                            }
                        } else {
                            aiResponse = "⚠️ Could not find any incomplete tasks matching your request.";
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Could not complete task(s). " + e.getMessage();
                    }
                    break;
                    
                case "DELETE_TASK":
                    try {
                        List<Task> allTasks = taskService.getAllUserTasks();
                        java.util.List<Task> tasksToDelete = new java.util.ArrayList<>();
                        
                        if (smartResponse.getTaskTitles() != null && !smartResponse.getTaskTitles().isEmpty()) {
                            for (String tt : smartResponse.getTaskTitles()) {
                                for (Task t : allTasks) {
                                    if (t.getTitle().toLowerCase().contains(tt.toLowerCase()) ||
                                        tt.toLowerCase().contains(t.getTitle().toLowerCase())) {
                                        tasksToDelete.add(t);
                                        break;
                                    }
                                }
                            }
                        } else if (smartResponse.getTaskTitle() != null) {
                            for (Task t : allTasks) {
                                if (t.getTitle().toLowerCase().contains(smartResponse.getTaskTitle().toLowerCase()) ||
                                    smartResponse.getTaskTitle().toLowerCase().contains(t.getTitle().toLowerCase())) {
                                    tasksToDelete.add(t);
                                    break;
                                }
                            }
                        }
                        
                        if (!tasksToDelete.isEmpty()) {
                            StringBuilder sb = new StringBuilder("🗑️ Deleted the following tasks:\n");
                            for (Task t : tasksToDelete) {
                                taskService.deleteTask(t.getId());
                                sb.append("- ").append(t.getTitle()).append("\n");
                            }
                            aiResponse = sb.toString();
                        } else {
                            aiResponse = "⚠️ Could not find the task(s) to delete.";
                        }
                    } catch (Exception e) {
                        aiResponse = "⚠️ Error deleting task(s): " + e.getMessage();
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