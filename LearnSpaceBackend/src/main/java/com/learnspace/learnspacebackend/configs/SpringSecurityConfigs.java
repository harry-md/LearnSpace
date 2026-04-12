package com.learnspace.learnspacebackend.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.learnspace.learnspacebackend.pojo.UserRole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement
@ComponentScan(
        basePackages = {
            "com.learnspace.learnspacebackend.controllers",
            "com.learnspace.learnspacebackend.repositories",
            "com.learnspace.learnspacebackend.services",
            "com.learnspace.learnspacebackend.mappers"
        })
public class SpringSecurityConfigs {
    @Autowired
    private Environment env;

    @Bean
    public static BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(c -> c.disable())
                .authorizeHttpRequests(requests -> requests.requestMatchers(
                                "/js/**", "/css/**", "/image/**")
                        .permitAll()
                        .requestMatchers("/login")
                        .permitAll()
                        .requestMatchers("/register")
                        .permitAll()
                        .requestMatchers("/")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/*")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categories/*")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/api/categories/*")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/*")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/*")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/courses")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(HttpMethod.PUT, "/api/courses/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/courses/*/chapters",
                                "/api/courses/*/chapters/*")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/courses/*/chapters")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(HttpMethod.PUT, "/api/courses/*/chapters/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/*/chapters/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/chapters/*/lessons",
                                "/api/chapters/*/lessons/*")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/chapters/*/lessons")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(HttpMethod.PUT, "/api/chapters/*/lessons/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/chapters/*/lessons/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .anyRequest()
                        .authenticated())
                .formLogin(form -> form.loginPage("/login")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/", true)
                        .failureUrl("/login?error=true")
                        .permitAll())
                .logout(logout -> logout.logoutSuccessUrl("/login").permitAll());
        return http.build();
    }

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
