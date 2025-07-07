package com.onemorecoin.common.oauthjwt.oauth2;

import java.io.IOException;
import java.sql.Date;
import java.time.Duration;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.http.HttpHeaders; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.onemorecoin.common.oauthjwt.dto.CustomOAuth2User;
import com.onemorecoin.common.oauthjwt.entity.RefreshTokenEntity;
import com.onemorecoin.common.oauthjwt.jwt.JWTUtil;
import com.onemorecoin.common.oauthjwt.repository.RefreshTokenRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;


@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final String callbackBase;   // ← 도메인 기반 URL
    private final int accessExp;
    private final int refreshExp;
    
    public CustomSuccessHandler(
            JWTUtil jwtUtil,
            RefreshTokenRepository refreshTokenRepository,
            @Value("${oauth.callback-base}") String callbackBase,
            @Value("${spring.jwt.access-exp}") int accessExp,
            @Value("${spring.jwt.refresh-exp}") int refreshExp) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.callbackBase = callbackBase;
        this.accessExp = accessExp;
        this.refreshExp = refreshExp;
    }



	@Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        String name = customUserDetails.getName();
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성

        String access = jwtUtil.createJwt("access", username, name, role,  accessExp * 60 * 1000L);
        String refresh = jwtUtil.createJwt("refresh", username, name, role, refreshExp * 24 * 60 * 60 * 1000L);
        
        //Refresh 토큰 저장
        addRefreshEntity(username, refresh, 14 * 24 * 60 * 60 * 1000L);

         /* 4. 쿠키 생성 ─ HttpOnly + Secure + SameSite */
        ResponseCookie accessCookie = ResponseCookie.from("ACCESS", access)      // ★ 수정
                .httpOnly(true).secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofMinutes(accessExp))
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("REFRESH", refresh)   // ★ 수정
                .httpOnly(true).secure(true)
                .sameSite("Strict")
                .path("/springapi/reissue")
                .maxAge(Duration.ofDays(refreshExp))
                .build();
        

        /* 5. 쿠키를 응답 헤더에 추가 */
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());     // ★ 수정
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());    // ★ 수정
        response.setStatus(HttpStatus.OK.value());

        /* 6. 프런트 SPA 진입점으로 리다이렉트 (토큰 쿼리 제거) */
        response.sendRedirect(callbackBase + "/oauth-callback");         
	}
	
	private void addRefreshEntity(String username, String refresh, Long expiredMs) {

	    RefreshTokenEntity refreshEntity = new RefreshTokenEntity();
	    refreshEntity.setUsername(username);
	    refreshEntity.setRefresh(refresh);
	    refreshEntity.setTtl(expiredMs / 1000);

	    refreshTokenRepository.save(refreshEntity);
	}
}
