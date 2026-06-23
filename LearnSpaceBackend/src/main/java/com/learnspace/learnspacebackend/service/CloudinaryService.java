package com.learnspace.learnspacebackend.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    void validateImageFile(MultipartFile file);

    void validateVideoFile(MultipartFile file);

    String uploadImage(MultipartFile file);

    String uploadVideo(MultipartFile file);

    void deleteImage(String url);

    void deleteVideo(String url);
}
