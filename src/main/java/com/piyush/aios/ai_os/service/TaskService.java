package com.piyush.aios.ai_os.service;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.repository.GoalRepository;
import com.piyush.aios.ai_os.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;

    public TaskService(TaskRepository taskRepository,
                       GoalRepository goalRepository) {

        this.taskRepository = taskRepository;
        this.goalRepository = goalRepository;
    }
}
