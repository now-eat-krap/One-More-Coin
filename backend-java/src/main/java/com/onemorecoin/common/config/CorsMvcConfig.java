package com.onemorecoin.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

	@Value("${oauth.redirect.url}")
	private String[] allowedOrigins; // 쉼표로 분리된 문자열 배열
	
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                /* 1️⃣ 허용 출처 (credentials=true 이므로 * 불가) */
                .allowedOrigins(allowedOrigins)

                /* 2️⃣ 허용 메서드 · 헤더 */
                .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                .allowedHeaders("*")

                /* 3️⃣ 쿠키 & 헤더 노출 */
                .allowCredentials(true)
                .exposedHeaders("Set-Cookie")   // 필요하면 "Authorization" 등 추가

                /* 4️⃣ Pre-flight 캐시 시간 */
                .maxAge(3600);                  // 1 시간
    }
}
