package com.example.keepitup.config;

import com.example.keepitup.util.UriConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.keepitup.jwt.JwtAuthenticationEntryPoint;
import com.example.keepitup.jwt.JwtAuthenticationFilter;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebMvc
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {
        return builder.getAuthenticationManager();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200", "http://keepitupapp.com", "https://keepitupapp.com", "http://www.keepitupapp.com", "https://www.keepitupapp.com", "http://54.221.132.43")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests

                                .requestMatchers(HttpMethod.POST, UriConstants.WORKOUTS_IN_PLAN).authenticated()
                                .requestMatchers(HttpMethod.POST, UriConstants.PLANS).authenticated()
                                .requestMatchers(HttpMethod.POST, UriConstants.WORKOUT_EXERCISE_IN_PLAN_CREATE).authenticated()
                        .requestMatchers(HttpMethod.DELETE, UriConstants.PLANS + UriConstants.BY_ID).authenticated()
                        .requestMatchers(HttpMethod.DELETE, UriConstants.PLANS + UriConstants.WORKOUT_IN_PLAN_DELETE).authenticated()

                        .requestMatchers(HttpMethod.POST, UriConstants.WEIGHINS).authenticated()
                        .requestMatchers(HttpMethod.DELETE, UriConstants.WEIGHINS + UriConstants.BY_ID).authenticated()

                        .requestMatchers(HttpMethod.POST, UriConstants.GYM).authenticated()
                        .requestMatchers(HttpMethod.DELETE, UriConstants.GYM + UriConstants.BY_ID).authenticated()
                        .requestMatchers(HttpMethod.GET, UriConstants.GET_GYM_BY_ID).authenticated()


                        .anyRequest().permitAll()
                )
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
