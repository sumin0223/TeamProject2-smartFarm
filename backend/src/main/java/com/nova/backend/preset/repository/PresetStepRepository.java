package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 현재 적용 단계 조회( 팜마다 )
@Repository
public interface PresetStepRepository extends JpaRepository<PresetStepEntity,Long> {
    List<PresetStepEntity> findByPreset(PresetEntity preset);
}
