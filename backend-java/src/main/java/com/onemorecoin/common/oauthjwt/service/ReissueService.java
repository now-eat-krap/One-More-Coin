package com.onemorecoin.common.oauthjwt.service;

import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface ReissueService {
	
	public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response);
	
	
}
