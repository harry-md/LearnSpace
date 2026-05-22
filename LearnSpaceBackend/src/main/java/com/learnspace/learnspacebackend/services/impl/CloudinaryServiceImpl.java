package com.learnspace.learnspacebackend.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.learnspace.learnspacebackend.services.CloudinaryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private static final int MAX_IMAGE_SIZE = 30 * 1024 * 1024;
    private static final int MAX_VIDEO_SIZE = 100 * 1024 * 1024;

    private static final List<String> DEFAULT_URLS = List.of(
            "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg",
            "https://res.cloudinary.com/dsc8rzpbg/video/upload/v1774930352/0_Teacher_Flowers_3840x2160_azcsmo.mp4",
            "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png");

    @Autowired
    private Cloudinary cloudinary;

    private boolean isDefaultUrl(String url) {
        return DEFAULT_URLS.contains(url);
    }

    private void validateImageFile(MultipartFile file) {
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Ảnh không được vượt quá 30MB");
        }
    }

    private void validateVideoFile(MultipartFile file) {
        if (file.getSize() > MAX_VIDEO_SIZE) {
            throw new IllegalArgumentException("Video không được vượt quá 100MB");
        }
    }

    private String uploadToCloudinary(MultipartFile file, String resourceType) {
        try {
            Map res = cloudinary
                    .uploader()
                    .upload(file.getBytes(), ObjectUtils.asMap("resource_type", resourceType));
            return res.get("secure_url").toString();
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi khi upload file");
        }
    }

    @Override
    public String uploadImage(MultipartFile file) {
        validateImageFile(file);
        return uploadToCloudinary(file, "image");
    }

    @Override
    public String uploadVideo(MultipartFile file) {
        validateVideoFile(file);
        return uploadToCloudinary(file, "video");
    }

    private void deleteFromCloudinary(String url, String resourceType) {
        try {
            String[] parts = url.split("/upload/");
            if (parts.length < 2) return;
            String pathAfterUpload = parts[1];
            if (pathAfterUpload.startsWith("v") && pathAfterUpload.contains("/")) {
                pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf("/") + 1);
            }
            String publicId = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf("."));
            cloudinary
                    .uploader()
                    .destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));

        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi khi xóa file");
        }
    }

    @Override
    public void deleteImage(String url) {
        if (url != null && !isDefaultUrl(url)) {
            deleteFromCloudinary(url, "image");
        }
    }

    @Override
    public void deleteVideo(String url) {
        if (url != null && !isDefaultUrl(url)) {
            deleteFromCloudinary(url, "video");
        }
    }
}
