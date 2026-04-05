package com.learnspace.learnspacebackend.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

@Configuration
public class DispatcherServletInit extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[] {ThymeleafConfigs.class, HibernateConfigs.class, SpringSecurityConfigs.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] {
            WebAppContextConfigs.class,
        };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] {"/"};
    }
}
