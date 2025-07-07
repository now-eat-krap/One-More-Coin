package com.onemorecoin.common.oauthjwt.jwt;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.filter.GenericFilterBean;

import com.onemorecoin.common.oauthjwt.repository.RefreshTokenRepository;
import io.jsonwebtoken.ExpiredJwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomLogoutFilter extends GenericFilterBean {

    /* ── 상수 ─────────────────────────────────────────────── */
    private static final String LOGOUT_URI      = "/logout";
    private static final String ACCESS_COOKIE   = "ACCESS";
    private static final String REFRESH_COOKIE  = "REFRESH";

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshRepo;

    public CustomLogoutFilter(JWTUtil jwtUtil,
                              RefreshTokenRepository refreshRepo) {
        this.jwtUtil     = jwtUtil;
        this.refreshRepo = refreshRepo;
    }

    /* ====================================================================== */
    @Override
    public void doFilter(ServletRequest  req,
                         ServletResponse res,
                         FilterChain     chain)
                         throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest)  req;
        HttpServletResponse response = (HttpServletResponse) res;

        /* 1) /logout POST가 아니면 그대로 필터 체인 진행 */
        if (!LOGOUT_URI.equals(request.getRequestURI())
            || !"POST".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        /* 2) REFRESH 쿠키 추출 */
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (REFRESH_COOKIE.equals(c.getName())) {
                    refresh = c.getValue();
                    break;
                }
            }
        }
        if (refresh == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                               "refresh cookie missing");
            return;
        }

        /* 3) REFRESH 토큰 검증(만료, 카테고리) 및 DB 존재 여부 확인 */
        try {
            jwtUtil.isExpired(refresh);
            if (!"refresh".equals(jwtUtil.getCategory(refresh))
                || !refreshRepo.existsById(refresh)) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                                   "invalid refresh token");
                return;
            }
        } catch (ExpiredJwtException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                               "refresh token expired");
            return;
        }

        /* 4) DB(REDIS) 에서 REFRESH 토큰 삭제 */
        refreshRepo.deleteById(refresh);

        /* 5) ACCESS, REFRESH 쿠키 모두 무효화 */
        ResponseCookie delAccess = ResponseCookie.from(ACCESS_COOKIE, "")
                .path("/")              // 생성 시와 동일
                .httpOnly(true).secure(true)
                .sameSite("Lax")
                .maxAge(0)
                .build();

        ResponseCookie delRefresh = ResponseCookie.from(REFRESH_COOKIE, "")
                .path("/")
                .httpOnly(true).secure(true)
                .sameSite("Strict")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, delAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, delRefresh.toString());

        /* 6) OK 응답 */
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
