package com.learnspace.learnspacebackend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {
    void validateImageFile(MultipartFile file);

    void validateVideoFile(MultipartFile file);

    String uploadImage(MultipartFile file) throws IOException;

    String uploadVideo(MultipartFile file) throws IOException;

    void deleteImage(String url) throws IOException;

    void deleteVideo(String url) throws IOException;
}
