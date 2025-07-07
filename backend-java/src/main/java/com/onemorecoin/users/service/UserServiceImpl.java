package com.onemorecoin.users.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.onemorecoin.common.oauthjwt.dto.CustomOAuth2User;
import com.onemorecoin.users.dto.UserProfileDto;

@Service
public class UserServiceImpl implements UserService {

	@Override
	public UserProfileDto getUserProfile(Authentication authentication) {

        /* 1) authentication null / 미인증 방어 */
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("로그인 정보가 없습니다.");   // ← 필요 시 Custom 예외로 교체
        }

        /* 2) principal 타입 검증 */
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomOAuth2User user)) {
            throw new IllegalStateException("인증 주체가 올바르지 않습니다.");
        }
        
        /* 3) DTO 반환 */
        return new UserProfileDto(
                user.getUsername(),
                user.getName(),
                user.getRole()
        );
    }	
}
