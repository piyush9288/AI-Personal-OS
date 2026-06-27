package com.piyush.aios.ai_os.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.piyush.aios.ai_os.entity.Task;
import com.piyush.aios.ai_os.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findByGoalId(Long goalId);
    long countByGoalId(Long goalId);
    long countByGoalIdAndStatus(Long goalId, TaskStatus status);
}
