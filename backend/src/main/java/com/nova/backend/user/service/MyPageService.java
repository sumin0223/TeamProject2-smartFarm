package com.nova.backend.user.service;

import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;

public interface MyPageService {
    MyPageResponseDTO findByUserId(Long userId);
    void updateMyPage(MyPageRequestDTO myPageRequestDTO);
}
