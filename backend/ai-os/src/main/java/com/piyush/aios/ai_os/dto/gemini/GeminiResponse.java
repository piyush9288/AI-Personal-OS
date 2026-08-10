package com.piyush.aios.ai_os.dto.gemini;


import java.util.List;

import lombok.Data;

@Data
public class GeminiResponse {

    private List<Candidate> candidates;

}
