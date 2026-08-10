package com.piyush.aios.ai_os.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ApiErrorResponse {
    private boolean success;
    private String message;
    private List<String> errors;
    private String timestamp;

    public ApiErrorResponse() {}

    public ApiErrorResponse(String message, List<String> errors) {
        this.success = false;
        this.message = message;
        this.errors = errors;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }

    public static ApiErrorResponse error(String message, List<String> errors) {
        return new ApiErrorResponse(message, errors);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
