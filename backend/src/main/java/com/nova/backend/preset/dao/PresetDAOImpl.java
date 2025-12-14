package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.repository.PresetRepository;
import com.nova.backend.user.dao.UsersDAO;
import com.nova.backend.user.dao.UsersDAOImpl;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
@RequiredArgsConstructor
public class PresetDAOImpl implements PresetDAO {
    private final PresetRepository presetRepository;
    private final UsersDAOImpl usersDAOImpl;
    private final UsersDAO usersDAO;

    @Override
    public void insertPreset(PresetEntity presetEntity) {
        presetRepository.save(presetEntity);
    }

    @Override
    public List<PresetEntity> findPresetListByUserId(Long userId) {
        UsersEntity user = usersDAO.findByUserId(userId);
        return presetRepository.findByUser(user);
    }

    @Override
    public void updatePreset() {
        
    }

    @Override
    public void deletePreset() {

    }
}
