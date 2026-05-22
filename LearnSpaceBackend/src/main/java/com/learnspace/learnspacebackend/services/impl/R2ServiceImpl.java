package com.learnspace.learnspacebackend.services.impl;

import com.drew.imaging.mp4.Mp4MetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.mp4.Mp4Directory;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.UUID;

@Service
@PropertySource("classpath:env.properties")
public class R2ServiceImpl implements R2Service {

    @Autowired
    private S3Client r2Client;

    @Autowired
    private Environment env;

    @Override
    public String uploadVideo(File video, String contentType, String folder) {
        String bucketName = env.getProperty("r2.bucket_name");
        String publicUrl = env.getProperty("r2.public_url");

        String originFileName = video.getName();
        String extension = "";
        if (originFileName != null && originFileName.contains(".")) {
            extension = originFileName.substring(originFileName.lastIndexOf("."));
        }
        String key = folder + "/" + UUID.randomUUID() + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .contentDisposition("inline")
                    .build();

            r2Client.putObject(putRequest, RequestBody.fromFile(video));

            return publicUrl + "/" + key;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi khi upload file");
        }
    }

    @Override
    public int getVideoLength(File video) {
        try (InputStream inputStream = new BufferedInputStream(new FileInputStream(video))) {
            Metadata metadata = Mp4MetadataReader.readMetadata(inputStream);

            Mp4Directory directory = metadata.getFirstDirectoryOfType(Mp4Directory.class);
            if (directory != null && directory.containsTag(Mp4Directory.TAG_DURATION_SECONDS)) {
                return directory.getInt(Mp4Directory.TAG_DURATION_SECONDS);
            }
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi khi đọc độ dài video");
        }
        return 0;
    }

    @Override
    public void deleteVideo(String videoUrl) {
        String bucketName = env.getProperty("r2.bucket_name");
        String publicUrl = env.getProperty("r2.public_url");
        String key = videoUrl.replace(publicUrl + "/", "");

        try {
            DeleteObjectRequest delRequest =
                    DeleteObjectRequest.builder().bucket(bucketName).key(key).build();
            r2Client.deleteObject(delRequest);
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Có lỗi khi xóa video");
        }
    }
}
