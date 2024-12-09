package com.aknst.blognest.dto;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UpdatePostRequest {
    private String title;
    private String content;
    private String brief;
    private UUID coverFileId;
    private Set<TagDTO> tags;
}
