package com.aknst.blognest.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserSummaryDTO {
    private Long id;
    private String name;
    private String username;
    private UUID blogId;
    private UUID avatarFileId;
}
