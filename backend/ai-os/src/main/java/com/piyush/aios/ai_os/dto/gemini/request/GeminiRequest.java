package com.piyush.aios.ai_os.dto.gemini.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeminiRequest {

    private List<ContentRequest> contents;

}