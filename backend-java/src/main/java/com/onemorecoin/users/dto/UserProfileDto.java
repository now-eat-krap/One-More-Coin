package com.onemorecoin.users.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileDto {
	private String username;
    private String name;
    private String role;
    
	public UserProfileDto(String username, String name, String role) {
		this.username = username;
		this.name = name;
		this.role = role;
	}
	
    
}
