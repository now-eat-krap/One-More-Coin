package com.onemorecoin.common.oauthjwt.jwt;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.onemorecoin.common.oauthjwt.dto.CustomOAuth2User;
import com.onemorecoin.common.oauthjwt.dto.UserDto;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class JWTFilter extends OncePerRequestFilter{

	private final JWTUtil jwtUtil;
	public JWTFilter(JWTUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		/* 1️⃣  ACCESS 토큰 추출 순서
        ① Authorization 헤더(Bearer) → ② ACCESS 쿠키                */
		String accessToken = null;
		
		// ── ① 헤더
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
		    accessToken = authHeader.substring(7);
		}
		
		// ── ② 쿠키
		if (accessToken == null) {
		    Cookie[] cookies = Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]);
		    for (Cookie c : cookies) {
		        if ("ACCESS".equals(c.getName())) {
		            accessToken = c.getValue();
		            break;
		        }
		    }
		}
		
		// 토큰이 없으면 다음 필터로
		if (accessToken == null) {
		    filterChain.doFilter(request, response);
		    return;
		}
		
		/* 2️⃣  만료·카테고리 검증 */
		try {
		    jwtUtil.isExpired(accessToken);
		    if (!"access".equals(jwtUtil.getCategory(accessToken))) {
		        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "invalid access token");
		        return;
		    }
		} catch (ExpiredJwtException e) {
		    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "access token expired");
		    return;
		}
		
		/* 3️⃣  SecurityContext 에 인증 객체 주입 */
		UserDto dto = new UserDto();
		dto.setUsername(jwtUtil.getUsername(accessToken));
		dto.setName(jwtUtil.getName(accessToken));
		dto.setRole(jwtUtil.getRole(accessToken));
		
		CustomOAuth2User principal = new CustomOAuth2User(dto);
		Authentication auth =
		    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		/* 4️⃣  다음 필터 진행 */
		filterChain.doFilter(request, response);
	}
}
