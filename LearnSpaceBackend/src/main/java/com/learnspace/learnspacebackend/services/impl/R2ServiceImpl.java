package com.learnspace.learnspacebackend.services.impl;

import com.drew.imaging.mp4.Mp4MetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.mp4.Mp4Directory;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
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
    public String uploadFile(MultipartFile file, String folder) {
        String bucketName = env.getProperty("r2.bucket_name");
        String publicUrl = env.getProperty("r2.public_url");

        String originFileName = file.getOriginalFilename();
        String extension = "";
        if (originFileName != null && originFileName.contains(".")) {
            extension = originFileName.substring(originFileName.lastIndexOf("."));
        }
        String key = folder + "/" + UUID.randomUUID() + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentDisposition("inline")
                    .build();

            r2Client.putObject(
                    putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return publicUrl + "/" + key;
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi khi upload file");
        }
    }

    @Override
    public int getVideoLength(MultipartFile video) {
        try (InputStream inputStream = video.getInputStream()) {
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
}
