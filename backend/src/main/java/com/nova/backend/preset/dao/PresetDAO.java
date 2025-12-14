package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.user.entity.UsersEntity;

import java.util.List;

public interface PresetDAO {
    void insertPreset(PresetEntity presetEntity);
    List<PresetEntity> findPresetListByUserId(Long userId);
    void updatePreset();
    void deletePreset();
}
