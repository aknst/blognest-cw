package com.aknst.blognest.service;

import com.aknst.blognest.dto.LoginRequest;
import com.aknst.blognest.dto.SignUpRequest;

public interface AuthService {
    String login(LoginRequest loginDto);

    String register(SignUpRequest registerDto);
}
