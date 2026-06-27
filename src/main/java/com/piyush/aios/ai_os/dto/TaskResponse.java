package com.piyush.aios.ai_os.dto;

import com.piyush.aios.ai_os.entity.GoalStatus;

import lombok.Data;

@Data
public class TaskResponse {
    private Long id;

    private String title;

    private String description;

    private GoalStatus status;

    private Integer progress;
}
