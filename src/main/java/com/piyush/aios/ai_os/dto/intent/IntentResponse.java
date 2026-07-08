package com.piyush.aios.ai_os.dto.intent;

import com.piyush.aios.ai_os.ai.Intent;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IntentResponse {

    private Intent intent;

}