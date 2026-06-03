package com.learnspace.learnspacebackend.services.impl;

import com.drew.imaging.mp4.Mp4MetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.mp4.Mp4Directory;
import com.learnspace.learnspacebackend.services.R2Service;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
public class R2ServiceImpl implements R2Service {

    @Autowired
    private S3Client r2Client;

    @Value("${r2.bucket_name}")
    private String bucketName;

    @Value("${r2.public_url}")
    private String publicUrl;

    @Autowired
    private Tika tika;

    @Override
    public void validateMp4File(File file) {
        try {
            String mime = tika.detect(file);
            if (!mime.equals("video/mp4")) {
                throw new IllegalArgumentException("Chỉ chấp nhận upload file mp4");
            }
        } catch (IOException ex) {
            throw new RuntimeException("Lỗi khi đọc file video");
        }
    }

    @Override
    public String uploadVideo(File video, String contentType, String folder) {
        String originFileName = video.getName();
        String extension = "";
        if (originFileName.contains(".")) {
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
            throw new RuntimeException("Lỗi khi đọc độ dài video");
        }
        return 0;
    }

    @Override
    public void deleteVideo(String videoUrl) {
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

    @Override
    public void deleteVideos(List<String> videoUrls) {
        List<ObjectIdentifier> keys = videoUrls.stream()
                .map(url -> ObjectIdentifier.builder()
                        .key(url.replace(publicUrl + "/", ""))
                        .build())
                .toList();

        if (keys.isEmpty()) {
            return;
        }
        try {
            DeleteObjectsRequest delRequest = DeleteObjectsRequest.builder()
                    .bucket(bucketName)
                    .delete(Delete.builder().objects(keys).quiet(true).build())
                    .build();

            r2Client.deleteObjects(delRequest);
        } catch (Exception e) {
            throw new RuntimeException("Có lỗi khi xóa video");
        }
    }
}
