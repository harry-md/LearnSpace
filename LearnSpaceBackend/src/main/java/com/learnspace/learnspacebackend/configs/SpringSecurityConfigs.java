package com.learnspace.learnspacebackend.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.learnspace.learnspacebackend.pojo.UserRole;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement
@EnableMethodSecurity
@ComponentScan(
        basePackages = {
            "com.learnspace.learnspacebackend.controllers",
            "com.learnspace.learnspacebackend.repositories",
            "com.learnspace.learnspacebackend.services",
            "com.learnspace.learnspacebackend.mappers",
            "com.learnspace.learnspacebackend.filters",
            "com.learnspace.learnspacebackend.utils",
        })
public class SpringSecurityConfigs {
    @Autowired
    private Environment env;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(
                            new ClassPathResource("firebase-service-account.json")
                                    .getInputStream()))
                    .build();
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(webCorsConfigurationSource()))
                .authorizeHttpRequests(
                        requests -> requests.requestMatchers("/js/**", "/css/**", "/image/**")
                                .permitAll()
                                .requestMatchers("/login")
                                .permitAll()
                                .requestMatchers("/register")
                                .hasRole(UserRole.ADMIN.name())
                                .requestMatchers("/")
                                .hasRole(UserRole.ADMIN.name())
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
    public CorsConfigurationSource webCorsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("https://dreaded-chain-securely.ngrok-free.dev"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
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

    @Bean
    public Tika tika() {
        return new Tika();
    }

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
