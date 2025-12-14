package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresetRepository extends JpaRepository<PresetEntity,Integer> {
    List<PresetEntity> findByUser(UsersEntity user);
}
