package com.learnspace.learnspacebackend.services;

import org.springframework.web.multipart.MultipartFile;

public interface R2Service {

    String uploadFile(MultipartFile video, String folder);

    int getVideoLength(MultipartFile video);
}
