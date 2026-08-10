package com.piyush.aios.ai_os.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateGoalRequest;
import com.piyush.aios.ai_os.dto.UpdateGoalRequest;
import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.GoalStatus;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.exception.GoalNotFoundException;
import com.piyush.aios.ai_os.repository.GoalRepository;
import com.piyush.aios.ai_os.security.CurrentUserService;

@Service
public class GoalService {
    private final GoalRepository goalRepository;
    private final CurrentUserService currentUserService;

    public GoalService(
            GoalRepository goalRepository,
            CurrentUserService currentUserService) {

        this.goalRepository = goalRepository;
        this.currentUserService = currentUserService;
    }

    public Goal createGoal(CreateGoalRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Goal goal = new Goal();

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setStatus(GoalStatus.NOT_STARTED);
        goal.setProgress(0);
        goal.setUser(currentUser);  

        return goalRepository.save(goal);
    }

    public List<Goal> getAllGoals() {

        User currentUser = currentUserService.getCurrentUser();

        return goalRepository.findByUser(currentUser);
    }

    public Goal getGoalById(Long id) {

        User currentUser = currentUserService.getCurrentUser();

        return goalRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() ->
                        new GoalNotFoundException("Goal not found"));
    }

    public Goal updateGoal(Long id, UpdateGoalRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Goal goal = goalRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() ->
                        new GoalNotFoundException("Goal not found"));

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());

        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id) {

        User currentUser = currentUserService.getCurrentUser();

        Goal goal = goalRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() ->
                        new GoalNotFoundException("Goal not found"));

        goalRepository.delete(goal);

    }
}
