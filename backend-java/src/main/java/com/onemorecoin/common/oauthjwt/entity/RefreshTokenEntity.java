package com.onemorecoin.common.oauthjwt.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@RedisHash(value = "refreshToken", timeToLive = 60*60*24)
public class RefreshTokenEntity {

    @Id
    private String refresh;      // “refresh” 토큰 자체를 ID로 사용

    private String username;     // (Optional) 이 토큰의 주인
    private String expirations;  // (Optional) 만료 정보 (문자열 형태)
}
