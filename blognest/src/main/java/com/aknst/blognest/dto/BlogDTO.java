package com.aknst.blognest.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class BlogDTO {
    private UUID id;
    private String title;
    private String description;
    private UserSummaryDTO author;
}