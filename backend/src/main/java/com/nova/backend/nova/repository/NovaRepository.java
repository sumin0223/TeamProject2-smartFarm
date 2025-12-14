package com.nova.backend.nova.repository;

import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NovaRepository extends JpaRepository<NovaEntity, Integer> {
    List<NovaEntity> findByUser(UsersEntity user);
}
