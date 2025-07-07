package com.onemorecoin.common.config;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.onemorecoin.common.oauthjwt.jwt.CustomLogoutFilter;
import com.onemorecoin.common.oauthjwt.jwt.JWTFilter;
import com.onemorecoin.common.oauthjwt.jwt.JWTUtil;
import com.onemorecoin.common.oauthjwt.oauth2.CustomAuthenticationEntryPoint;
import com.onemorecoin.common.oauthjwt.oauth2.CustomAuthenticationFailureHandler;
import com.onemorecoin.common.oauthjwt.oauth2.CustomSuccessHandler;
import com.onemorecoin.common.oauthjwt.repository.RefreshTokenRepository;
import com.onemorecoin.common.oauthjwt.service.CustomOAuth2UserService;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final CustomSuccessHandler customSuccessHandler;
	private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
	public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, CustomSuccessHandler customSuccessHandler,
			CustomAuthenticationFailureHandler customAuthenticationFailureHandler, JWTUtil jwtUtil,
			RefreshTokenRepository refreshTokenRepository) {
		this.customOAuth2UserService = customOAuth2UserService;
		this.customSuccessHandler = customSuccessHandler;
		this.customAuthenticationFailureHandler = customAuthenticationFailureHandler;
		this.jwtUtil = jwtUtil;
		this.refreshTokenRepository = refreshTokenRepository;
	}


	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
	    //csrf disable
        http
                .csrf((auth) -> auth.disable());

        //From 로그인 방식 disable
        http
                .formLogin((auth) -> auth.disable());

        //HTTP Basic 인증 방식 disable
        http
                .httpBasic((auth) -> auth.disable());
        
        //JWTFilter 추가
		http
        	.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);		
		
		http
        	.addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshTokenRepository), LogoutFilter.class);
		
		//oauth2
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler)
                        .failureHandler(customAuthenticationFailureHandler)
                        );

        //예외 처리, 이거 없으면 login html이 그냥 반환됨
        http
        	.exceptionHandling(exception -> exception
        			.authenticationEntryPoint(new CustomAuthenticationEntryPoint())
        );
        
        //경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/","/springapi/reissue","/oauth2/**","/login/oauth2/**" ).permitAll()
                        .anyRequest().authenticated());

        //세션 설정 : STATELESS
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
		return http.build();
	}
}
