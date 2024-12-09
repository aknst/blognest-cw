package com.aknst.blognest.dto;

public record AuthResponse(String accessToken, UserDTO user) {
}
