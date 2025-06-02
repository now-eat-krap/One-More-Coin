package com.onemorecoin.common.oauthjwt.repository;

import org.springframework.data.repository.CrudRepository;

import com.onemorecoin.common.oauthjwt.entity.RefreshTokenEntity;

import jakarta.transaction.Transactional;

public interface RefreshTokenRepository extends CrudRepository<RefreshTokenEntity, String> {

}
