package com.piyush.aios.ai_os.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {

    @NotBlank
    private String prompt;

    private List<FileData> files;

    @Data
    public static class FileData {
        private String mimeType;
        private String base64Data;
    }
}