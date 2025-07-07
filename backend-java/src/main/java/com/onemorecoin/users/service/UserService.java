package com.onemorecoin.users.service;


import org.springframework.security.core.Authentication;

import com.onemorecoin.users.dto.UserProfileDto;

public interface UserService {
	public UserProfileDto getUserProfile(Authentication authentication);
}
