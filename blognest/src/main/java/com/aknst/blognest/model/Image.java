package com.aknst.blognest.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private UUID id;
    private String name;
    private String type;
    @Lob
    private byte[] data;
    private ZonedDateTime createdAt;

    @PrePersist
    public void onPrePersist() {
        createdAt = ZonedDateTime.now();
    }
}
