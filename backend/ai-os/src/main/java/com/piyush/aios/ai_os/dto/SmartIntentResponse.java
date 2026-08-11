package com.piyush.aios.ai_os.dto;

import lombok.Data;

@Data
public class SmartIntentResponse {
    private String intent;
    private String goalTitle;
    private String taskTitle;
    private String title;
    private String aiResponse;
}
