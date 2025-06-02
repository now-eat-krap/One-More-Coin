package com.onemorecoin.common.oauthjwt.service;

import java.sql.Date;

import org.springframework.http.HttpStatus;
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
    public ReissueServiceImpl(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
		this.jwtUtil = jwtUtil;
		this.refreshTokenRepository = refreshTokenRepository;
	}

	@Override
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        // 1. 쿠키에서 refresh token 찾기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh".equals(cookie.getName())) {
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
    	Boolean isExist = refreshTokenRepository.existsByRefresh(refresh);
    	if (!isExist) {
    		
		   //response body
		   return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
    	}
        

        // 4. 사용자 정보 추출
        String username = jwtUtil.getUsername(refresh);
        String name = jwtUtil.getName(refresh);
        String role = jwtUtil.getRole(refresh);

        // 5. access token 재발급
        String newAccess = jwtUtil.createJwt("access", username, name, role, 600000L);
        // refresh rotate -> 리프레시 토큰이 사용되면 새로발급
        String newRefresh = jwtUtil.createJwt("refresh", username, name, role, 86400000L);
        
        
        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        System.out.println("deleteRefreshToken");
    	refreshTokenRepository.deleteByRefresh(refresh);
    	addRefreshEntity(username, newRefresh, 86400000L);
        
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));
        return new ResponseEntity<>(HttpStatus.OK);
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
        //cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
