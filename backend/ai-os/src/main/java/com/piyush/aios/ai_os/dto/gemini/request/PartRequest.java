package com.piyush.aios.ai_os.dto.gemini.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PartRequest {

    private String text;

    @JsonProperty("inline_data")
    private InlineData inlineData;

    public PartRequest(String text) {
        this.text = text;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InlineData {
        @JsonProperty("mime_type")
        private String mimeType;
        private String data;
    }
}