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
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        };
        
        Exception lastException = null;

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
            } catch (org.springframework.web.reactive.function.client.WebClientResponseException.NotFound e) {
                System.err.println("Gemini API Error (404) for URL " + currentUrl + ": " + e.getMessage());
                lastException = e;
                // Continue to the next fallback model
            } catch (Exception e) {
                System.err.println("Gemini API Error for URL " + currentUrl + ": " + e.getMessage());
                e.printStackTrace();
                return "⚠️ It looks like the AI cannot be reached. Error: " + e.getMessage() + ". Please check if your GEMINI_API_KEY is correctly set in your environment variables on Render.";
            }
        }
        
        return "⚠️ It looks like the AI cannot be reached. All fallback models returned 404 Not Found. Error: " + lastException.getMessage() + ". Please check if the Generative Language API is enabled for your project, or verify your region's access.";
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
                - CREATE_TASK: The user wants to create a task. Extract 'goalTitle' and 'taskTitle'.
                - COMPLETE_TASK: The user wants to mark a task as done. Extract 'taskTitle'.
                - DELETE_TASK: The user wants to delete a task. Extract 'taskTitle'.
                - DELETE_GOAL: The user wants to delete a goal. Extract 'title'.
                - SHOW_GOALS: The user wants to see their goals.
                - SHOW_TASKS: The user wants to see their tasks.
                - DASHBOARD: The user wants to see their stats.
                - GENERAL: The user is chatting, asking a question, or the request doesn't match above.
                
                CRITICAL INSTRUCTION: When extracting 'title', 'goalTitle', or 'taskTitle', extract ONLY the exact short name of the goal/task. DO NOT include the whole sentence, verbs, or extra context words.
                
                You MUST respond with ONLY a valid JSON object. No markdown formatting, no backticks.
                {
                  "intent": "CREATE_TASK",
                  "goalTitle": "extracted goal name if any",
                  "taskTitle": "extracted task name if any",
                  "title": "extracted generic title if any",
                  "aiResponse": "If intent is GENERAL, write your full helpful response here. Otherwise empty."
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
}
