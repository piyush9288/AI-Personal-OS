package com.piyush.aios.ai_os.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.piyush.aios.ai_os.dto.ApiResponse;
import com.piyush.aios.ai_os.dto.CreateTaskRequest;
import com.piyush.aios.ai_os.dto.UpdateTaskRequest;
import com.piyush.aios.ai_os.entity.Task;
import org.springframework.http.ResponseEntity;
import com.piyush.aios.ai_os.service.TaskService;

import jakarta.validation.Valid;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/goals/{goalId}/tasks")
    public ResponseEntity<ApiResponse<Task>> createTask(@PathVariable Long goalId,
                           @Valid @RequestBody CreateTaskRequest request) {
        Task task = taskService.createTask(goalId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Task created successfully", task));
    }

    @GetMapping("/goals/{goalId}/tasks")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksByGoal(@PathVariable Long goalId) {
        List<Task> tasks = taskService.getTasksByGoal(goalId);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", task));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(@PathVariable Long id,
                           @Valid @RequestBody UpdateTaskRequest request) {
        Task task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
