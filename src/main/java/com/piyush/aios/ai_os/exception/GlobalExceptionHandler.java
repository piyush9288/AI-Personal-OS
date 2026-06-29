package com.piyush.aios.ai_os.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public Map<String, String> handleTaskNotFound(TaskNotFoundException ex) {

        Map<String, String> error = new HashMap<>();

        error.put("error", ex.getMessage());

        return error;
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public Map<String, String> handleUserAlreadyExists(
            UserAlreadyExistsException ex) {

        Map<String, String> error = new HashMap<>();

        error.put("error", ex.getMessage());

        return error;
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public Map<String,String> handleInvalidCredentials(
            InvalidCredentialsException ex){

        Map<String,String> error = new HashMap<>();

        error.put("error", ex.getMessage());

        return error;
    }
}
