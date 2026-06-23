package com.learnspace.learnspacebackend.config;

import com.learnspace.learnspacebackend.entity.UserRole;
import com.learnspace.learnspacebackend.filters.JwtFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@Order(1)
public class ApiSecurityConfigs {
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain apiFilterChain(HttpSecurity http) {
        http.securityMatcher("/api/**")
                .cors(cors -> cors.configurationSource(apiCorsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/*")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/*")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/courses/*/reviews")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payments/webhook")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categories")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(HttpMethod.PATCH, "/api/categories/*")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/*")
                        .hasRole(UserRole.ADMIN.name())
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/courses",
                                "/api/courses/*/chapters",
                                "/api/chapters/*/lessons")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/courses/*",
                                "/api/chapters/*",
                                "/api/lessons/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/courses/*",
                                "/api/chapters/*",
                                "/api/lessons/*")
                        .hasRole(UserRole.VERIFIED_TEACHER.name())
                        .anyRequest()
                        .authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource apiCorsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
