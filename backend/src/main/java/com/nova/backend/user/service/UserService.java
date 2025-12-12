package com.nova.backend.user.service;

import com.nova.backend.user.dto.FindIdRequestDTO;
import com.nova.backend.user.dto.LoginRequestDTO;
import com.nova.backend.user.dto.ResetPasswordDTO;
import com.nova.backend.user.dto.SignupRequestDTO;

public interface UserService {

    //회원가입
    void signUp(SignupRequestDTO dto);
    //로그인
    Long login(LoginRequestDTO dto);
    //iD찾기
    String findUserId(FindIdRequestDTO dto);
    //비밀번호 재설정
    void resetPassword(ResetPasswordDTO dto);
}
