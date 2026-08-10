package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.dashboard.DashboardResponse;
import com.piyush.aios.ai_os.entity.GoalStatus;
import com.piyush.aios.ai_os.entity.TaskStatus;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.repository.GoalRepository;
import com.piyush.aios.ai_os.repository.TaskRepository;
import com.piyush.aios.ai_os.security.CurrentUserService;

@Service
public class DashboardService {

    private final GoalRepository goalRepository;
    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;

    public DashboardService(
            GoalRepository goalRepository,
            TaskRepository taskRepository,
            CurrentUserService currentUserService) {

        this.goalRepository = goalRepository;
        this.taskRepository = taskRepository;
        this.currentUserService = currentUserService;
    }

    public DashboardResponse getDashboard() {

        User currentUser = currentUserService.getCurrentUser();

        long totalGoals = goalRepository.countByUser(currentUser);

        long completedGoals = goalRepository.countByUserAndStatus(
                currentUser,
                GoalStatus.COMPLETED
        );

        long totalTasks = taskRepository.countByUser(currentUser);

        long completedTasks = taskRepository.countByUserAndStatus(
                currentUser,
                TaskStatus.COMPLETED
        );

        long pendingTasks = totalTasks - completedTasks;

        int overallProgress = totalTasks == 0
                ? 0
                : (int) ((completedTasks * 100) / totalTasks);

        return new DashboardResponse(
                totalGoals,
                completedGoals,
                totalTasks,
                completedTasks,
                pendingTasks,
                overallProgress
        );
    }
}