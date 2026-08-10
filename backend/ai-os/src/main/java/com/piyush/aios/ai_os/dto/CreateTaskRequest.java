package com.piyush.aios.ai_os.dto;

import java.time.LocalDate;

import com.piyush.aios.ai_os.entity.Priority;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private LocalDate dueDate;

    private Priority priority;
}