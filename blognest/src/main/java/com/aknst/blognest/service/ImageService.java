package com.aknst.blognest.service;

import com.aknst.blognest.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ImageService {
    Image saveImage(MultipartFile file);
    Image  getImageById(UUID id);
    void deleteImage(UUID id);
}

