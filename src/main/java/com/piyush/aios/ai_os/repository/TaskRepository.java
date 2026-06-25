package com.piyush.aios.ai_os.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.piyush.aios.ai_os.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{
    
}
