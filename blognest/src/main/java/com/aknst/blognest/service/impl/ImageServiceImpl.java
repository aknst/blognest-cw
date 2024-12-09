package com.aknst.blognest.service.impl;

import com.aknst.blognest.exception.FileStorageException;
import com.aknst.blognest.exception.ResourceNotFoundException;
import com.aknst.blognest.model.Image;
import com.aknst.blognest.repository.ImageRepository;
import com.aknst.blognest.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    @Override
    public Image saveImage(MultipartFile file) {
        if (!isImage(file)) {
            throw new FileStorageException("Invalid image file");
        }
        try {
            Image image = new Image();
            image.setName(file.getOriginalFilename());
            image.setType(file.getContentType());
            image.setData(file.getBytes());
            return imageRepository.save(image);
        } catch (IOException e) {
            throw new FileStorageException("Could not store the file. ", e);
        }
    }

    @Override
    public Image getImageById(UUID id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image", "id", id.toString()));
    }

    @Override
    public void deleteImage(UUID id) {
        imageRepository.deleteById(id);
    }

    private boolean isImage(MultipartFile file) {
        List<String> allowedMimeTypes = Arrays.asList(
                "image/png", "image/jpeg", "image/jpg",
                "image/gif", "image/bmp", "image/tiff"
        );
        String mimeType = file.getContentType();
        if (!allowedMimeTypes.contains(mimeType)) {
            return false;
        }
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            return image != null && image.getWidth() > 0 && image.getHeight() > 0;
        } catch (IOException e) {
            return false;
        }
    }

}
