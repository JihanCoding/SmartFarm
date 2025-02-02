package com.smhrd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class WebConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");  // ✅ 올바른 출처 설정
        config.addAllowedMethod("*");  // ✅ 모든 HTTP 메소드 허용
        config.addAllowedHeader("*");  // ✅ 모든 헤더 허용
        config.setAllowCredentials(true);  // ✅ 인증정보 포함

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
