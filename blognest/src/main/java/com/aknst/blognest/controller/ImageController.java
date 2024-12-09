package com.aknst.blognest.controller;


import com.aknst.blognest.dto.ImageDTO;
import com.aknst.blognest.model.Image;
import com.aknst.blognest.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import static com.aknst.blognest.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;
    private final ModelMapper modelMapper;

    @PostMapping(consumes = {"multipart/form-data"})
    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    public ResponseEntity<ImageDTO> uploadImage(@RequestParam("file") MultipartFile file) {
        Image savedImage = imageService.saveImage(file);
        ImageDTO imageDTO = modelMapper.map(savedImage, ImageDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable UUID id) {
        Image image = imageService.getImageById(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, image.getType());
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getName() + "\"");
        return new ResponseEntity<>(image.getData(), headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<Void> deleteImage(@PathVariable UUID id) {
        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
