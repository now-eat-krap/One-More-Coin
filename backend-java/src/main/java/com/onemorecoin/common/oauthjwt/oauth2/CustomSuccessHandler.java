package com.onemorecoin.common.oauthjwt.oauth2;

import java.io.IOException;
import java.sql.Date;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.http.HttpStatus;
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

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JWTUtil jwtUtil;
	private final RefreshTokenRepository refreshTokenRepository;
	public CustomSuccessHandler(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
		this.jwtUtil = jwtUtil;
		this.refreshTokenRepository = refreshTokenRepository;
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
        String access = jwtUtil.createJwt("access", username, name, role, 600000L);
        String refresh = jwtUtil.createJwt("refresh", username, name, role, 86400000L);

        //Refresh 토큰 저장
        addRefreshEntity(username, refresh, 86400000L);
    	
        //응답 설정
        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());
        response.sendRedirect("http://localhost:5173/oauth-callback?access=" + access);
    }
	
	private void addRefreshEntity(String username, String refresh, Long expiredMs) {

	    Date date = new Date(System.currentTimeMillis() + expiredMs);

	    RefreshTokenEntity refreshEntity = new RefreshTokenEntity();
	    refreshEntity.setUsername(username);
	    refreshEntity.setRefresh(refresh);
	    refreshEntity.setExpirations(date.toString());

	    refreshTokenRepository.save(refreshEntity);
	}

	private Cookie createCookie(String key, String value) {

	    Cookie cookie = new Cookie(key, value);
	    cookie.setMaxAge(24*60*60);
	    //cookie.setSecure(true);
	    cookie.setPath("/");
	    cookie.setHttpOnly(true);

	    return cookie;
	}
}
