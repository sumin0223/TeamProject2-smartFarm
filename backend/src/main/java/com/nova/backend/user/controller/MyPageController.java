package com.nova.backend.user.controller;

import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import com.nova.backend.user.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
@CrossOrigin
public class MyPageController {
    private final MyPageService myPageService;

    @GetMapping("/view")
    public MyPageResponseDTO findByUserId(@RequestParam("userId") Long userId) {
        return myPageService.findByUserId(userId);
    }

    @PostMapping("/edit")
    public void updateMyPage(@RequestBody MyPageRequestDTO myPageRequestDTO) {
        myPageService.updateMyPage(myPageRequestDTO);
    }
}
