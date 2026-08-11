package com.piyush.aios.ai_os.dto;

import lombok.Data;

@Data
public class SmartIntentResponse {
    private String intent;
    private String goalTitle;
    private String taskTitle;
    private java.util.List<String> taskTitles;
    private Integer count;
    private String title;
    private String aiResponse;
}
