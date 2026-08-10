package com.piyush.aios.ai_os.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGoalRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

}
