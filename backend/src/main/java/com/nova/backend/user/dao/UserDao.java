package com.nova.backend.user.dao;


import com.nova.backend.user.entity.UserEntity;

public interface UserDao {

    UserEntity save(UserEntity user);
    UserEntity findByLoginId(String loginId);
    UserEntity findByNameAndEmail(String name, String email);
    UserEntity findByNameAndPhoneNumber(String name, String phoneNumber);
    UserEntity findById(Long id);
}
