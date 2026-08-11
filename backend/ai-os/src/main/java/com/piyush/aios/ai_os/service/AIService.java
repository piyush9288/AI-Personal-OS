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
import com.piyush.aios.ai_os.entity.Task;



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
        if (goals.isEmpty()) {
                return "You don't have any goals yet. Create your first goal to get started!";
        }
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
                Mention the total number of goals in your response.
                """);

        GeminiRequest request = createRequest(prompt.toString());

        return callGemini(request);
        }

        public String generatePendingTaskSummary(List<Task> tasks){
                StringBuilder prompt = new StringBuilder();

                if (tasks.isEmpty()) {
                        return "🎉 Great job! You don't have any pending tasks.";
                }
                prompt.append("""
                        You are AI Personal OS.

                        These are pending tasks:
                        """);

                for (Task task : tasks) {

                        prompt.append("- ")
                                .append(task.getTitle())
                                .append("\n");

                }

                prompt.append("""

                        Summarize them in a clear and motivating way.

                        Mention:
                        - highest priority task
                        - recommended next step
                        - keep response under 120 words.
                        """);

                GeminiRequest request = createRequest(prompt.toString());

                return callGemini(request);
        }

    public String generateResponse(com.piyush.aios.ai_os.dto.ChatRequest chatRequest) {
        String prompt = chatRequest.getPrompt();
        chatService.saveUserMessage(prompt);

        List<PartRequest> parts = new java.util.ArrayList<>();
        parts.add(new PartRequest(prompt));

        if (chatRequest.getFiles() != null && !chatRequest.getFiles().isEmpty()) {
            for (com.piyush.aios.ai_os.dto.ChatRequest.FileData file : chatRequest.getFiles()) {
                PartRequest filePart = new PartRequest();
                filePart.setInlineData(new PartRequest.InlineData(file.getMimeType(), file.getBase64Data()));
                parts.add(filePart);
            }
        }

        List<ContentRequest> contents = new java.util.ArrayList<>();
        contents.add(new ContentRequest("user", List.of(new PartRequest(
            "SYSTEM INSTRUCTION: You are AI Personal OS, an intelligent productivity assistant. You can understand any language. If the user asks for pictures, images, links, or PDFs, provide them using Markdown format (e.g., ![alt](url) for images). Actively teach the user concepts they struggle with, provide resources, and motivate them to complete their goals."
        ))));
        contents.add(new ContentRequest("model", List.of(new PartRequest("Understood. I am ready to help."))));
        
        List<Chat> chats = chatService.getChatHistory();
        contents.addAll(
            chats.stream()
                .map(chat -> {
                    String role = chat.getRole() == ChatRole.USER ? "user" : "model";
                    return new ContentRequest(role, List.of(new PartRequest(chat.getMessage())));
                })
                .toList()
        );

        // Add the current request with files at the end
        contents.add(new ContentRequest("user", parts));

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
        String[] fallbackModels = {
            apiUrl,
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
        };
        
        Exception lastException = null;
        boolean rateLimitHit = false;

        for (String currentUrl : fallbackModels) {
            try {
                // Ensure no trailing spaces or newlines in the URL or Key
                String safeUrl = currentUrl.trim();
                String safeKey = apiKey.trim();
                
                GeminiResponse response = webClient.post()
                        .uri(safeUrl + "?key=" + safeKey)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(GeminiResponse.class)
                        .block();
    
                if (response == null
                        || response.getCandidates() == null
                        || response.getCandidates().isEmpty()) {
    
                        return "⚠️ Gemini returned an empty response.";
                }
    
                return response.getCandidates()
                        .get(0)
                        .getContent()
                        .getParts()
                        .get(0)
                        .getText();
            } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
                System.err.println("Gemini API Error (" + e.getStatusCode() + ") for URL " + currentUrl + ": " + e.getMessage());
                if (e.getStatusCode().value() == 429) {
                    rateLimitHit = true;
                    lastException = e; // prioritize 429
                } else if (!rateLimitHit) {
                    lastException = e;
                }
                // Continue to the next fallback model
            } catch (Exception e) {
                System.err.println("Gemini API Error for URL " + currentUrl + ": " + e.getMessage());
                e.printStackTrace();
                return "⚠️ It looks like the AI cannot be reached. Error: " + e.getMessage() + ". Please check if your GEMINI_API_KEY is correctly set in your environment variables on Render.";
            }
        }
        
        if (rateLimitHit) {
            return "⚠️ Gemini API Rate Limit Exceeded (429 Too Many Requests). The free tier resets every minute for short bursts, and daily at midnight Pacific Time for large quotas. Please wait a moment and try again.";
        }
        
        return "⚠️ It looks like the AI cannot be reached. All fallback models failed. Error: " + (lastException != null ? lastException.getMessage() : "Unknown") + ". Please check if the Generative Language API is enabled for your project, or verify your region's access.";
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

        public com.piyush.aios.ai_os.dto.SmartIntentResponse detectSmartIntent(String userMessage) {
            String prompt = """
                You are the core intelligence of AI Personal OS. The user will give you a command in English, Hindi, or Hinglish.
                Map the command to one of these intents and extract the required fields.
                - CREATE_GOAL: The user wants to create a goal. Extract 'title'.
                - CREATE_TASK: The user wants to create one or more tasks. Extract 'goalTitle' and 'taskTitles' (array of strings).
                - AUTO_GENERATE_TASKS: The user wants you to auto-generate tasks for a goal. Extract 'goalTitle' and optionally 'count' (integer). If they say 'all' or 'sara' or 'pura', set 'count': 8.
                - START_TUTORING: The user wants your help to complete tasks step-by-step or learn. Extract 'goalTitle' if available.
                - COMPLETE_TASK: The user wants to mark specific tasks as done (e.g. 'first 3 tasks', 'task A and B', 'all tasks for goal X'). Extract 'taskTitles' (array of EXACT short names. If they say 'first 3 tasks', infer their names from history if possible, else put 'count': 3).
                - COMPLETE_ALL_TASKS: The user wants to mark ALL their tasks as done across all goals.
                - DELETE_TASK: The user wants to delete specific tasks. Extract 'taskTitles' (array).
                - DELETE_GOAL: The user wants to delete a goal. Extract 'title'.
                - SHOW_GOALS: The user wants to see their goals.
                - SHOW_TASKS: The user wants to see their tasks.
                - DASHBOARD: The user wants to see their stats.
                - GENERAL: The user is chatting, asking for video links, asking a question, or the request doesn't match above.
                
                CRITICAL INSTRUCTION: When extracting 'title', 'goalTitle', or 'taskTitles', extract ONLY the exact short names of the goals/tasks. DO NOT include the whole sentence, verbs, or extra context words.
                
                You MUST respond with ONLY a valid JSON object. No markdown formatting, no backticks.
                {
                  "intent": "CREATE_TASK",
                  "goalTitle": "extracted goal name if any",
                  "taskTitle": "single task if any",
                  "taskTitles": ["task 1", "task 2"],
                  "count": 5,
                  "title": "extracted generic title if any",
                  "aiResponse": "If intent is GENERAL, write your full helpful response here. Never refuse a request. Be highly conversational in the user's language."
                }
                
                User Command: "%s"
                """.formatted(userMessage);
                
            try {
                String responseText = callGemini(createRequest(prompt));
                if (responseText.startsWith("⚠️")) {
                    com.piyush.aios.ai_os.dto.SmartIntentResponse res = new com.piyush.aios.ai_os.dto.SmartIntentResponse();
                    res.setIntent("GENERAL");
                    res.setAiResponse(responseText);
                    return res;
                }
                
                // Clean markdown if Gemini accidentally included it
                responseText = responseText.replace("```json", "").replace("```", "").trim();
                
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                return mapper.readValue(responseText, com.piyush.aios.ai_os.dto.SmartIntentResponse.class);
            } catch (Exception e) {
                com.piyush.aios.ai_os.dto.SmartIntentResponse res = new com.piyush.aios.ai_os.dto.SmartIntentResponse();
                res.setIntent("GENERAL");
                res.setAiResponse("⚠️ Could not process smart intent: " + e.getMessage());
                return res;
            }
        }

        public List<String> generateTasksForGoal(String goalTitle, Integer count) {
            int taskCount = (count != null && count > 0) ? count : 3;
            String prompt = """
                You are AI Personal OS. The user wants to auto-generate tasks for their goal: "%s".
                Create EXACTLY %d highly relevant, actionable tasks to help them achieve this goal.
                
                You MUST respond with ONLY a valid JSON array of strings. No markdown formatting, no backticks.
                ["Task 1", "Task 2"]
                """.formatted(goalTitle, taskCount);
            
            try {
                String responseText = callGemini(createRequest(prompt));
                responseText = responseText.replace("```json", "").replace("```", "").trim();
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                return mapper.readValue(responseText, new com.fasterxml.jackson.core.type.TypeReference<List<String>>(){});
            } catch (Exception e) {
                return java.util.List.of("Learn the basics of " + goalTitle, "Practice " + goalTitle, "Build a project using " + goalTitle);
            }
        }
}
