package com.piyush.aios.ai_os.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    private long totalGoals;

    private long completedGoals;

    private long totalTasks;

    private long completedTasks;

    private long pendingTasks;

    private int overallProgress;

}