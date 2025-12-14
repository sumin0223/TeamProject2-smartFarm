package com.nova.backend.user.repository;

import com.nova.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    //로그인용(LoginId로 조회)
    UserEntity findByLoginId(String loginId);

    //Id 찾기(이름 + 이메일)
    UserEntity findByNameAndEmail(String name, String email);

    //Id 찾기(이름 + 전화번호)
    UserEntity findByNameAndPhoneNumber(String name, String phoneNumber);

    //  이메일 존재 여부 확인 (비밀번호 찾기용)
    boolean existsByEmail(String email);

    // 비밀번호 재설정 (이메일)
    UserEntity findByEmail(String email);

    // ✅ 비밀번호 재설정 (전화번호)
    UserEntity findByPhoneNumber(String phoneNumber);
}
