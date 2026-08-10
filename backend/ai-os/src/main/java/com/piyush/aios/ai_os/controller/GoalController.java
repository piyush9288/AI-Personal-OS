package com.piyush.aios.ai_os.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.piyush.aios.ai_os.dto.ApiResponse;
import com.piyush.aios.ai_os.dto.CreateGoalRequest;
import com.piyush.aios.ai_os.dto.UpdateGoalRequest;
import com.piyush.aios.ai_os.entity.Goal;
import org.springframework.http.ResponseEntity;
import com.piyush.aios.ai_os.service.GoalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/goals")
public class GoalController {
    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Goal>> createGoal(@Valid @RequestBody CreateGoalRequest request) {
        Goal goal = goalService.createGoal(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Goal created successfully", goal));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Goal>>> getAllGoals() {
        List<Goal> goals = goalService.getAllGoals();
        return ResponseEntity.ok(ApiResponse.success("Goals retrieved successfully", goals));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Goal>> getGoalById(@PathVariable Long id) {
        Goal goal = goalService.getGoalById(id);
        return ResponseEntity.ok(ApiResponse.success("Goal retrieved successfully", goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Goal>> updateGoal(@PathVariable Long id,
                           @Valid @RequestBody UpdateGoalRequest request) {
        Goal goal = goalService.updateGoal(id, request);
        return ResponseEntity.ok(ApiResponse.success("Goal updated successfully", goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok(ApiResponse.success("Goal deleted successfully", null));
    }
}
