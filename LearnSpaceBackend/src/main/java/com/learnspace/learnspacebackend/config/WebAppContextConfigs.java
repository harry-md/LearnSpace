package com.learnspace.learnspacebackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
@EnableTransactionManagement
@EnableWebMvc
@ComponentScan(
        basePackages = {
            "com.learnspace.learnspacebackend.controller",
            "com.learnspace.learnspacebackend.repository",
            "com.learnspace.learnspacebackend.config",
            "com.learnspace.learnspacebackend.service",
            "com.learnspace.learnspacebackend.mappers",
            "com.learnspace.learnspacebackend.util",
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
}
