package com.onemorecoin.common.oauthjwt.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class CustomOAuth2User implements OAuth2User {

	private final UserDto userDto;
	public CustomOAuth2User(UserDto userDto) {
		this.userDto = userDto;
	}

	@Override
	public Map<String, Object> getAttributes() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collection = new ArrayList<>();
		
		collection.add(new GrantedAuthority() {
			
			@Override
			public String getAuthority() {
				return userDto.getRole();
			}
		});
		return collection;
	}

	@Override
	public String getName() {
		return userDto.getName();
	}

	public String getUsername() {
		return userDto.getUsername();
	}
	
	public String getRole() {
		return userDto.getRole();
	}
}
