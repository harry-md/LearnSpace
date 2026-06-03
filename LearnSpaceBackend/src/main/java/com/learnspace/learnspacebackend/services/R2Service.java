package com.learnspace.learnspacebackend.services;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface R2Service {
    void validateMp4File(File file) throws IOException, RuntimeException;

    String uploadVideo(File video, String contentType, String folder);

    int getVideoLength(File video);

    void deleteVideo(String videoUrl);

    void deleteVideos(List<String> videoUrls);
}
