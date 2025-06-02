package com.onemorecoin.common.oauthjwt.dto.response;

import java.util.Map;

public class KakaoResponse implements OAuth2Response {
    private final Map<String, Object> attribute;

    public KakaoResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
    }

    @Override
    public String getProviderId() {
        // "id"는 최상위 속성으로 제공됩니다.
        Object idObj = attribute.get("id");
        return idObj != null ? idObj.toString() : null;
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getName() {
        // 카카오 프로필 내 "properties" 맵에 "nickname" 항목이 들어있습니다.
        Object propertiesObj = attribute.get("properties");
        if (!(propertiesObj instanceof Map)) {
            return null;
        }
        Map<String, Object> properties = (Map<String, Object>) propertiesObj;

        Object nicknameObj = properties.get("nickname");
        return nicknameObj != null ? nicknameObj.toString() : null;
    }

    @Override
    public String getEmail() {
        // 카카오 계정 정보는 "kakao_account" 맵 안에 "email" 항목으로 제공됩니다.
        Object kakaoAccountObj = attribute.get("kakao_account");
        if (!(kakaoAccountObj instanceof Map)) {
            return null;
        }
        Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoAccountObj;

        Object emailObj = kakaoAccount.get("email");
        return emailObj != null ? emailObj.toString() : null;
    }
}
