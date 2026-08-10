package com.piyush.aios.ai_os.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.piyush.aios.ai_os.entity.Task;
import com.piyush.aios.ai_os.entity.TaskStatus;
import com.piyush.aios.ai_os.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long>{

    List<Task> findByGoalId(Long goalId);

    List<Task> findByGoalIdAndUser(Long goalId, User user);

    long countByGoalId(Long goalId);

    long countByGoalIdAndStatus(Long goalId, TaskStatus status);

    Optional<Task> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, TaskStatus status);

    List<Task> findByUserAndStatus(User user, TaskStatus status);

    List<Task> findByUser(User user);
}
