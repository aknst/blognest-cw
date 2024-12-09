package com.aknst.blognest.dto;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UpdateUserRequest {
    private String name;
    private String username;
    private UUID avatarFileId;
}
