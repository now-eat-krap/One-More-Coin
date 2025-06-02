package com.onemorecoin.common.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onemorecoin.common.oauthjwt.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	UserEntity findByUsername(String username);
}
