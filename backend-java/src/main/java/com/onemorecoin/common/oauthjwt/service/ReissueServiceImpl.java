package com.onemorecoin.common.oauthjwt.service;

import java.io.IOException;
import java.sql.Date;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.onemorecoin.common.oauthjwt.entity.RefreshTokenEntity;
import com.onemorecoin.common.oauthjwt.jwt.JWTUtil;
import com.onemorecoin.common.oauthjwt.repository.RefreshTokenRepository;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class ReissueServiceImpl implements ReissueService {

	private final JWTUtil jwtUtil;
	private final RefreshTokenRepository refreshTokenRepository;
	private final int accessExp;
    private final int refreshExp;
    
    public ReissueServiceImpl(JWTUtil jwtUtil,
    		RefreshTokenRepository refreshTokenRepository,
    		@Value("${spring.jwt.access-exp}") int accessExp,
            @Value("${spring.jwt.refresh-exp}") int refreshExp) {
		this.jwtUtil = jwtUtil;
		this.refreshTokenRepository = refreshTokenRepository;
		this.accessExp = accessExp;
        this.refreshExp = refreshExp;
	}

	@Override
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        // 1. 쿠키에서 refresh token 찾기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("REFRESH".equals(cookie.getName())) {
                    refresh = cookie.getValue();
                    break;
                }
            }
        }

        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 2. 만료 확인
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 3. category 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        
        //DB에 저장되어 있는지 확인
    	Boolean isExist = refreshTokenRepository.existsById(refresh);
    	if (!isExist) {
    		
		   //response body
		   return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
    	}
        

        // 4. 사용자 정보 추출
        String username = jwtUtil.getUsername(refresh);
        String name = jwtUtil.getName(refresh);
        String role = jwtUtil.getRole(refresh);

        // 5. access token 재발급
        String newAccess  = jwtUtil.createJwt("access",  username, name, role, accessExp * 60 * 1000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, name, role, refreshExp * 24 * 60 * 60 * 1000L);

        
        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshTokenRepository.deleteById(refresh);
        addRefreshEntity(username, refresh, 14 * 24 * 60 * 60 * 1000L);
        
        /* 5) 쿠키 교체 – 성공 핸들러와 동일한 속성 */
        ResponseCookie accessCookie = ResponseCookie.from("ACCESS", newAccess)
                .httpOnly(true).secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofMinutes(accessExp))
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("REFRESH", newRefresh)
                .httpOnly(true).secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofDays(refreshExp))
                .build();
       

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        
        return ResponseEntity.ok().build();   // 바디 불필요, 쿠키만 교체
    }
	
	private void addRefreshEntity(String username, String refresh, Long expiredMs) {

	    RefreshTokenEntity refreshEntity = new RefreshTokenEntity();
	    refreshEntity.setUsername(username);
	    refreshEntity.setRefresh(refresh);
	    refreshEntity.setTtl(expiredMs / 1000);

	    refreshTokenRepository.save(refreshEntity);
	}
   
}
