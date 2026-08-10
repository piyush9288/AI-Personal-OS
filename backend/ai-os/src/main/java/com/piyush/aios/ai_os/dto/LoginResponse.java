package com.piyush.aios.ai_os.dto;

import com.piyush.aios.ai_os.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private User user;
}
