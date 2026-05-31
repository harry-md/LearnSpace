package com.learnspace.learnspacebackend.configs;

import com.github.benmanes.caffeine.cache.Caffeine;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.*;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableTransactionManagement
@EnableWebMvc
@EnableCaching
@ComponentScan(
        basePackages = {
            "com.learnspace.learnspacebackend.controllers",
            "com.learnspace.learnspacebackend.repositories",
            "com.learnspace.learnspacebackend.configs",
            "com.learnspace.learnspacebackend.services",
            "com.learnspace.learnspacebackend.mappers",
            "com.learnspace.learnspacebackend.exceptions",
            "com.learnspace.learnspacebackend.interceptors",
            "com.learnspace.learnspacebackend.utils",
            "com.learnspace.learnspacebackend.filters",
        })
public class WebAppContextConfigs implements WebMvcConfigurer {

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
    }

    @Bean
    public StandardServletMultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.APPLICATION_JSON);
    }

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager =
                new CaffeineCacheManager("paypalAccessToken", "exchangeRate");
        cacheManager.setCaffeine(
                Caffeine.newBuilder().expireAfterWrite(9, TimeUnit.HOURS).maximumSize(1));
        return cacheManager;
    }
}
