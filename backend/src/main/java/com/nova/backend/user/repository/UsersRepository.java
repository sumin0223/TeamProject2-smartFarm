package com.nova.backend.user.repository;

import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<UsersEntity, Long> {
    UsersEntity findByUserId(Long userId);
}

