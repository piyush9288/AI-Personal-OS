package com.piyush.aios.ai_os.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.piyush.aios.ai_os.entity.Goal;
import com.piyush.aios.ai_os.entity.User;

public interface GoalRepository extends JpaRepository<Goal, Long>{
    List<Goal> findByUser(User user);
}
