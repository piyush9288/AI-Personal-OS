package com.piyush.aios.ai_os.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;
import com.piyush.aios.ai_os.dto.ApiErrorResponse;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleTaskNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(404).body(ApiErrorResponse.error(ex.getMessage(), List.of()));
    }

    @ExceptionHandler(GoalNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleGoalNotFound(GoalNotFoundException ex) {
        return ResponseEntity.status(404).body(ApiErrorResponse.error(ex.getMessage(), List.of()));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleUserAlreadyExists(
            UserAlreadyExistsException ex) {
        return ResponseEntity.status(409).body(ApiErrorResponse.error(ex.getMessage(), List.of()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException ex){
        return ResponseEntity.status(401).body(ApiErrorResponse.error(ex.getMessage(), List.of()));
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();
        return ResponseEntity.status(400).body(ApiErrorResponse.error("Validation failed", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneralException(Exception ex) {
        return ResponseEntity.status(500).body(ApiErrorResponse.error("An unexpected error occurred", List.of(ex.getMessage())));
    }
}
