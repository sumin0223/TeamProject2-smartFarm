package com.nova.backend.nova.dao;

import com.nova.backend.nova.entity.NovaEntity;

import java.util.List;

public interface NovaDAO {
    List<NovaEntity> getNovaEntity(int userId);
    void update(List<NovaEntity> novaEntityList);
    void delete(List<NovaEntity> novaEntityList);
    void create(List<NovaEntity> novaEntityList);
}
