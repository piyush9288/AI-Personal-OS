package com.piyush.aios.ai_os.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.piyush.aios.ai_os.dto.CreateTaskRequest;
import com.piyush.aios.ai_os.dto.UpdateTaskRequest;
import com.piyush.aios.ai_os.entity.Task;
import com.piyush.aios.ai_os.service.TaskService;

import jakarta.validation.Valid;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/goals/{goalId}/tasks")
    public Task createTask(@PathVariable Long goalId,
                           @Valid @RequestBody CreateTaskRequest request) {

        return taskService.createTask(goalId, request);
    }

    @GetMapping("/goals/{goalId}/tasks")
    public List<Task> getTasksByGoal(@PathVariable Long goalId) {

        return taskService.getTasksByGoal(goalId);
    }

    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable Long id) {

        return taskService.getTaskById(id);
    }

    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id,
                           @Valid @RequestBody UpdateTaskRequest request) {

        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);
    }
}
