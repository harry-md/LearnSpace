package com.learnspace.learnspacebackend.services;

import java.io.File;

public interface R2Service {

    String uploadVideo(File video, String contentType, String folder);

    int getVideoLength(File video);

    void deleteVideo(String videoUrl);
}
