package com.piyush.aios.ai_os.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateTaskRequest;
import com.piyush.aios.ai_os.dto.UpdateTaskRequest;
import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.GoalStatus;
import com.piyush.aios.ai_os.entity.Task;
import com.piyush.aios.ai_os.entity.TaskStatus;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.exception.GoalNotFoundException;
import com.piyush.aios.ai_os.exception.TaskNotFoundException;
import com.piyush.aios.ai_os.repository.GoalRepository;
import com.piyush.aios.ai_os.repository.TaskRepository;
import com.piyush.aios.ai_os.security.CurrentUserService;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final CurrentUserService currentUserService;

    public TaskService(TaskRepository taskRepository,
                   GoalRepository goalRepository,
                   CurrentUserService currentUserService) {

        this.taskRepository = taskRepository;
        this.goalRepository = goalRepository;
        this.currentUserService = currentUserService;
    }

    public Task createTask(Long goalId, CreateTaskRequest request){
        Goal goal = goalRepository.findById(goalId)
            .orElseThrow(() ->
                new GoalNotFoundException(
                    "Goal not found with id : " + goalId));

         Task task = new Task();

        User currentUser = currentUserService.getCurrentUser();

        task.setUser(currentUser);


        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());

        task.setStatus(TaskStatus.NOT_STARTED);

        task.setGoal(goal);

        Task savedTask = taskRepository.save(task);

        updateGoalProgress(goal);

        return savedTask;
    }

    public Task getTaskById(Long id) {

        User currentUser = currentUserService.getCurrentUser();

        return taskRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found with id : " + id));
    }

    public List<Task> getTasksByGoal(Long goalId) {

        User currentUser = currentUserService.getCurrentUser();

        Goal goal = goalRepository.findByIdAndUser(goalId, currentUser)
                .orElseThrow(() ->
                        new GoalNotFoundException(
                                "Goal not found with id : " + goalId));

        return taskRepository.findByGoalId(goalId);

    }

    public Task updateTask(Long id, UpdateTaskRequest request) {

        Task task = getTaskById(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());

        Task updatedTask = taskRepository.save(task);

        updateGoalProgress(task.getGoal());

        return updatedTask;

    }

    public void deleteTask(Long id) {

        Task task = getTaskById(id);

        Goal goal = task.getGoal();

        taskRepository.delete(task);

        updateGoalProgress(goal);

    }

    private void updateGoalProgress(Goal goal) {
        long totalTasks = taskRepository.countByGoalId(goal.getId());

        long completedTasks = taskRepository.countByGoalIdAndStatus(
            goal.getId(),
            TaskStatus.COMPLETED);

        if (totalTasks == 0) {

            goal.setProgress(0);
            goal.setStatus(GoalStatus.NOT_STARTED);

        } else {
            int progress = (int) ((completedTasks * 100) / totalTasks);

            goal.setProgress(progress);

            if (progress == 100) {
                goal.setStatus(GoalStatus.COMPLETED);
            } else if (progress > 0) {
                goal.setStatus(GoalStatus.IN_PROGRESS);
            } else {
                goal.setStatus(GoalStatus.NOT_STARTED);
            }

        }

        goalRepository.save(goal);
    }
}
