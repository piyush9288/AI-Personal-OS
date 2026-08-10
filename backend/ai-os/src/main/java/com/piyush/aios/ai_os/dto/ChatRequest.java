package com.piyush.aios.ai_os.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {

    @NotBlank
    private String prompt;

}