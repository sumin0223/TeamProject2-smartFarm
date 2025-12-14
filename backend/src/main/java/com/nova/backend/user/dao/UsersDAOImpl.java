package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UsersDAOImpl implements UsersDAO {
    private final UsersRepository usersRepository;
    @Override
    public UsersEntity findByUserId(Long userId) {
        return usersRepository.findByUserId(userId);
    }

    @Override
    public void update(UsersEntity usersEntity) {
        usersRepository.save(usersEntity);
    }
}
