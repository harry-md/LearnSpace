package com.learnspace.learnspacebackend.configs;

import com.learnspace.learnspacebackend.pojo.UserRole;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
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
                .authorizeHttpRequests(
                        requests -> requests.requestMatchers("/js/**", "/css/**", "/image/**")
                                .permitAll()
                                .requestMatchers("/login")
                                .permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/categories/**")
                                .permitAll()
                                .requestMatchers("/api/categories/**")
                                .hasRole(UserRole.ADMIN.name())
                                .requestMatchers(HttpMethod.GET, "/api/courses/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/courses")
                                .hasRole("VERIFIED_TEACHER"))
                .formLogin(form -> form.loginPage("/login")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/", true)
                        .failureUrl("/login?error=true")
                        .permitAll())
                .logout(logout -> logout.logoutSuccessUrl("/login").permitAll());
        return http.build();
    }
}
