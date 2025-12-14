package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MyPageDAOImpl implements MyPageDAO {
    private final UsersRepository usersRepository;
}
