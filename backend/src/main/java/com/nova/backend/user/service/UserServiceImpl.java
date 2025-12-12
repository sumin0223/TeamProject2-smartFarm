package com.nova.backend.user.service;

import com.nova.backend.user.dao.UserDao;
import com.nova.backend.user.dto.FindIdRequestDTO;
import com.nova.backend.user.dto.LoginRequestDTO;
import com.nova.backend.user.dto.ResetPasswordDTO;
import com.nova.backend.user.dto.SignupRequestDTO;
import com.nova.backend.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserDao userDao;

    @Override
    public void signUp(SignupRequestDTO dto) {
        UserEntity exist = userDao.findByLoginId(dto.getLoginId());
        if (exist != null) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        //새 엔티티 생성
        UserEntity user = new UserEntity();
        user.setLoginId(dto.getLoginId());
        user.setName(dto.getName());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPostalCode(dto.getPostalCode());
        user.setAddress(dto.getAddress());
        user.setAddressDetail(dto.getAddressDetail());
        user.setCreateDate(LocalDateTime.now());
        user.setRole("user");
        user.setLoginType("normal");

        userDao.save(user);
    }

    @Override
    public Long login(LoginRequestDTO dto) {
        UserEntity user = userDao.findByLoginId(dto.getLoginId());
        if( user == null ) {
            throw new RuntimeException("아이디가 존재하지 않습니다.");
        }
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다");
        }

        //Last_Login_date 업데이트
        user.setLastLoginDate(LocalDateTime.now());
        userDao.save(user);
        return user.getUserId();

    }

    @Override
    public String findUserId(FindIdRequestDTO dto) {

        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            UserEntity user = userDao.findByNameAndEmail(dto.getName(), dto.getEmail());
            if (user == null) {
                throw new RuntimeException("해당 정보로 가입된 아이디가 없습니다.");
            }
            return user.getLoginId();
        }

        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isEmpty()) {
            UserEntity user = userDao.findByNameAndPhoneNumber(dto.getName(), dto.getPhoneNumber());
            if (user == null) {
                throw new RuntimeException("해당 정보로 가입된 아이디가 없습니다.");
            }
            return user.getLoginId();
        }

        throw new RuntimeException("잘못된 요청입니다.");
    }

    @Override
    public void resetPassword(ResetPasswordDTO dto) {

        UserEntity user = userDao.findById(dto.getUserId());
        if (user == null) {
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        user.setPassword(dto.getNewPassword());
        userDao.save(user);
    }
}
