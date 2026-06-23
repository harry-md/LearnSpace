package com.learnspace.learnspacebackend.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@RequiredArgsConstructor
@Configuration
public class StorageConfig {
    private final Environment env;

    @Bean
    public S3Client r2Client() {
        String accountId = env.getProperty("r2.account_id");
        String accessKey = env.getProperty("r2.access_key");
        String secretKey = env.getProperty("r2.secret_key");
        return S3Client.builder()
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .region(Region.of("auto"))
                .serviceConfiguration(
                        S3Configuration.builder().chunkedEncodingEnabled(false).build())
                .build();
    }
}
