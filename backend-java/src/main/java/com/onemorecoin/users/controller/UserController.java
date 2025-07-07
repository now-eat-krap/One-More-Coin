package com.onemorecoin.users.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onemorecoin.users.dto.UserProfileDto;
import com.onemorecoin.users.service.UserService;

@RestController
@RequestMapping("/springapi/users")
public class UserController {
	private final UserService userService;
	public UserController(UserService userService) {
		this.userService = userService;
	}


	@GetMapping("/me")
	public UserProfileDto getMyProfile(Authentication authentication) {
		return userService.getUserProfile(authentication);
	}
}
