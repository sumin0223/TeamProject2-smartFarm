package com.nova.backend.user.controller;


import com.nova.backend.user.dto.FindIdRequestDTO;
import com.nova.backend.user.dto.LoginRequestDTO;
import com.nova.backend.user.dto.ResetPasswordDTO;
import com.nova.backend.user.dto.SignupRequestDTO;
import com.nova.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDTO dto) {
        userService.signUp(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        Long userId = userService.login(dto);

        return ResponseEntity.ok("로그인 성공! userId = " + userId);
    }

    //아이디 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody FindIdRequestDTO dto) {
        String loginId = userService.findUserId(dto);
        return ResponseEntity.ok(loginId);
    }

    //비밀번호 찾기 
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO dto) {
        userService.resetPassword(dto);
        return ResponseEntity.ok("비밀번호 변경 성공");
    }
}
