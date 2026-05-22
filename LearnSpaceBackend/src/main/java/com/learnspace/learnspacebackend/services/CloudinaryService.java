package com.learnspace.learnspacebackend.services;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    String uploadImage(MultipartFile file);

    String uploadVideo(MultipartFile file);

    void deleteImage(String url);

    void deleteVideo(String url);
}
