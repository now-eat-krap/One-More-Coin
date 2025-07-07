package com.onemorecoin.common.oauthjwt.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@RedisHash("refreshToken")
public class RefreshTokenEntity {

    @Id
    private String refresh;      // “refresh” 토큰 자체를 ID로 사용

    private String username;     // (Optional) 이 토큰의 주인
    
    @TimeToLive                     // 👈 초(Seconds) 단위
    private Long ttl;               // 저장 시점에 값을 채워야 동작
}
