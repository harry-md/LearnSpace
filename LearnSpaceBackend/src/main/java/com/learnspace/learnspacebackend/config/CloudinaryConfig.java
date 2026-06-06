package com.learnspace.learnspacebackend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@RequiredArgsConstructor
@Configuration
public class CloudinaryConfig {
    private final Environment env;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name",
                env.getProperty("cloudinary.cloud_name"),
                "api_key",
                env.getProperty("cloudinary.api_key"),
                "api_secret",
                env.getProperty("cloudinary.api_secret"),
                "secure",
                true));
    }
}
