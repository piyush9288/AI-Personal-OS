package com.piyush.aios.ai_os.dto.ai;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalExtractionResponse {
    private String title;
    private String description;
    private LocalDate targetDate;
}
