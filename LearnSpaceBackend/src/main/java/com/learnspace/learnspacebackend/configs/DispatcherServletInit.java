package com.learnspace.learnspacebackend.configs;

import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletRegistration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

@Configuration
public class DispatcherServletInit extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[] {
            ThymeleafConfigs.class,
            HibernateConfigs.class,
            SpringSecurityConfigs.class,
            ApiSecurityConfigs.class
        };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] {
            WebAppContextConfigs.class,
        };
    }

    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        String location = "/tmp";
        long maxFileSize = 500 * 1024 * 1024;
        long maxRequestSize = 500 * 1024 * 1024;
        int fileSizeThreshold = 0;
        registration.setMultipartConfig(new MultipartConfigElement(
                location, maxFileSize, maxRequestSize, fileSizeThreshold));
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] {"/"};
    }
}
