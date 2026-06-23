package com.learnspace.learnspacebackend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.learnspace.learnspacebackend.exception.CloudinaryException;
import com.learnspace.learnspacebackend.service.CloudinaryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;
    private final Tika tika;

    private static final int MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    private static final int MAX_VIDEO_SIZE = 100 * 1024 * 1024;

    private static final List<String> DEFAULT_URLS = List.of(
            "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg",
            "https://res.cloudinary.com/dsc8rzpbg/video/upload/v1774930352/0_Teacher_Flowers_3840x2160_azcsmo.mp4",
            "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png");

    private boolean isDefaultUrl(String url) {
        return DEFAULT_URLS.contains(url);
    }

    @Override
    public void validateImageFile(MultipartFile file) {
        if (file.getSize() > MAX_IMAGE_SIZE) {
            log.warn("Upload thất bại: Ảnh quá 10MB - Kích thước file: {}", file.getSize());
            throw new CloudinaryException(
                    "MAX_IMAGE_SIZE_EXCEEDED", "Ảnh vượt quá kích thước cho phép");
        }
        try {
            String mimeType = tika.detect(file.getInputStream());
            if (!mimeType.startsWith("image/")) {
                log.warn("Upload thất bại: File không phải ảnh - MimeType: {}", mimeType);
                throw new CloudinaryException("NOT_IMAGE_FILETYPE", "File không phải là ảnh");
            }
        } catch (IOException ex) {
            log.error("Lỗi đọc file ảnh", ex);
            throw new CloudinaryException("PROCEED_IMAGE_ERROR", "Lỗi khi đọc dữ liệu ảnh", ex);
        }
    }

    @Override
    public void validateVideoFile(MultipartFile file) {
        if (file.getSize() > MAX_VIDEO_SIZE) {
            log.warn("Upload thất bại: Video quá 100MB - Kích thước thật: {}", file.getSize());
            throw new CloudinaryException(
                    "MAX_VIDEO_SIZE_EXCEEDED", "Video vượt kích thước cho phép");
        }
        try {
            String mimeType = tika.detect(file.getInputStream());
            if (!mimeType.startsWith("video")) {
                log.warn("Upload thất bại: File không phải video - MimeType: {}", mimeType);
                throw new CloudinaryException("NOT_VIDEO_FILETYPE", "File không phải là video");
            }
        } catch (IOException ex) {
            log.error("Lỗi đọc file video", ex);
            throw new CloudinaryException("PROCEED_VIDEO_ERROR", "Lỗi khi đọc dữ liệu video", ex);
        }
    }

    private String uploadToCloudinary(MultipartFile file, String resourceType) {
        try {
            Map res = cloudinary
                    .uploader()
                    .upload(file.getBytes(), ObjectUtils.asMap("resource_type", resourceType));
            log.info("Upload thành công lên Cloudinary, URL: {}", res.get("secure_url"));
            return res.get("secure_url").toString();
        } catch (IOException ex) {
            log.error("Cloudinary Upload Exception: Lỗi upload file", ex);
            throw new CloudinaryException("FILE_UPLOAD_FAILED", "Có lỗi khi upload ảnh");
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
        String[] parts = url.split("/upload/");
        if (parts.length < 2) return;
        String pathAfterUpload = parts[1];
        if (pathAfterUpload.startsWith("v") && pathAfterUpload.contains("/")) {
            pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf("/") + 1);
        }
        String publicId = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf("."));

        try {
            cloudinary
                    .uploader()
                    .destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
            log.info("Đã xóa file khỏi Cloudinary: {}", url);
        } catch (IOException ex) {
            log.error("Cloudinary Delete Exception: Lỗi khi xóa file", ex);
            throw new CloudinaryException("FILE_DELETE_FAILED", "Có lỗi khi xóa ảnh", ex);
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
