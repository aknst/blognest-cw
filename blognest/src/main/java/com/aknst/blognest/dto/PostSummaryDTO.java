package com.aknst.blognest.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.Set;
import java.util.UUID;

@Data
public class PostSummaryDTO {
    private Long id;
    private String title;
    private String brief;
    private UUID coverFileId;
    private ZonedDateTime createdAt;
    private UserSummaryDTO author;
    private Set<TagDTO> tags;
}
