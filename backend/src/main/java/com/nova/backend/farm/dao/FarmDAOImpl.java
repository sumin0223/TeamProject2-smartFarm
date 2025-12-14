package com.nova.backend.farm.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FarmDAOImpl implements FarmDAO{
    private final FarmRepository farmRepository;
    @Override
    public void save(FarmEntity farmEntity) {
        farmRepository.save(farmEntity);
    }

    @Override
    public List<FarmEntity> findListByNovaId(Long novaId) {
        return farmRepository.findByNova_NovaId(novaId);
    }
    @Override
    public List<FarmEntity> findFarmsPresetStepsByNovaId(Long novaId){
        return farmRepository.findFarmsWithDetailsByNovaId(novaId);
    }

}
