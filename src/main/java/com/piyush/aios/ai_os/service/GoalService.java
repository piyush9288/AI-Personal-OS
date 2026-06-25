package com.piyush.aios.ai_os.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateGoalRequest;
import com.piyush.aios.ai_os.dto.UpdateGoalRequest;
import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.GoalStatus;
import com.piyush.aios.ai_os.exception.GoalNotFoundException;
import com.piyush.aios.ai_os.repository.GoalRepository;

@Service
public class GoalService {
    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository){
        this.goalRepository = goalRepository;
    }

    public Goal createGoal(CreateGoalRequest request) {

        Goal goal = new Goal();

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setStatus(GoalStatus.NOT_STARTED);

        return goalRepository.save(goal);
    }

    public List<Goal> getAllGoals() {

        return goalRepository.findAll();

    }

    public Goal getGoalById(Long id) {

        return goalRepository.findById(id)
                .orElseThrow(() ->
                        new GoalNotFoundException(
                                "Goal not found with id : " + id));

    }

    public Goal updateGoal(Long id,
                       UpdateGoalRequest request) {

        Goal goal = getGoalById(id);

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());

        return goalRepository.save(goal);

    }

    public void deleteGoal(Long id) {

        Goal goal = getGoalById(id);

        goalRepository.delete(goal);

    }
}
