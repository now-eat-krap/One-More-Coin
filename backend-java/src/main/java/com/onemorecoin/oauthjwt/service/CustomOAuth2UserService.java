package com.onemorecoin.oauthjwt.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.onemorecoin.oauthjwt.dto.CustomOAuth2User;
import com.onemorecoin.oauthjwt.dto.UserDto;
import com.onemorecoin.oauthjwt.dto.response.GoogleResponse;
import com.onemorecoin.oauthjwt.dto.response.KakaoResponse;
import com.onemorecoin.oauthjwt.dto.response.NaverResponse;
import com.onemorecoin.oauthjwt.dto.response.OAuth2Response;
import com.onemorecoin.oauthjwt.entity.UserEntity;
import com.onemorecoin.oauthjwt.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
 
	private final UserRepository userRepository;
	public CustomOAuth2UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}


	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

		OAuth2User oAuth2User = super.loadUser(userRequest);
		System.out.println(oAuth2User);
		
		String registraionId = userRequest.getClientRegistration().getRegistrationId() ;
		OAuth2Response oAuth2Response = null;
		
		if(registraionId.equals("naver")) {
			oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
		}
		else if(registraionId.equals("google")) {
			oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
		}
		else if(registraionId.equals("kakao")) {
			oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
		}
		else {
			return null;
		}
		
		String username = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();

		UserEntity existData = userRepository.findByUsername(username);

		
		// db에 정보가 없으면 회원가입 시킨다
        if (existData == null) {

            UserEntity userEntity = new UserEntity();
            userEntity.setUsername(username);
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setRole("ROLE_USER");

            userRepository.save(userEntity);

            UserDto userDTO = new UserDto();
            userDTO.setUsername(username);
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");

            return new CustomOAuth2User(userDTO);
        }
        else {

            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            userRepository.save(existData);

            UserDto userDTO = new UserDto();
            userDTO.setUsername(existData.getUsername());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole(existData.getRole());

            return new CustomOAuth2User(userDTO);
        }
	}
}
