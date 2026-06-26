package com.piyush.aios.ai_os.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.CreateTaskRequest;
import com.piyush.aios.ai_os.dto.UpdateTaskRequest;
import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.Task;
import com.piyush.aios.ai_os.entity.TaskStatus;
import com.piyush.aios.ai_os.exception.GoalNotFoundException;
import com.piyush.aios.ai_os.exception.TaskNotFoundException;
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

    public Task createTask(Long goalId, CreateTaskRequest request){
        Goal goal = goalRepository.findById(goalId)
            .orElseThrow(() ->
                new GoalNotFoundException(
                    "Goal not found with id : " + goalId));

         Task task = new Task();


        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());

        task.setStatus(TaskStatus.NOT_STARTED);

        task.setGoal(goal);

        return taskRepository.save(task);
    }

    public Task getTaskById(Long id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found with id : " + id));

    }

    public List<Task> getTasksByGoal(Long goalId) {

        goalRepository.findById(goalId)
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

        return taskRepository.save(task);

    }

    public void deleteTask(Long id) {

        Task task = getTaskById(id);

        taskRepository.delete(task);

    }
}
