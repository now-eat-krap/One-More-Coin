package com.onemorecoin.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onemorecoin.oauthjwt.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	UserEntity findByUsername(String username);
}
