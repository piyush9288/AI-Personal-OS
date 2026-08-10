package com.piyush.aios.ai_os.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskFromAIRequest {

    private String goalTitle;

    private String taskTitle;

}