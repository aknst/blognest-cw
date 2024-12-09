package com.aknst.blognest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageDTO {
    private UUID id;
    private String name;
    private String type;
    private ZonedDateTime createdAt;
}
