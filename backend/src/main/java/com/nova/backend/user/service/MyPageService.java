package com.nova.backend.user.service;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import com.nova.backend.user.dto.MyPageTimelapseResponseDTO;
import org.springframework.web.bind.annotation.RequestParam;
import com.nova.backend.farm.Entity.Farm;

import java.util.List;

public interface MyPageService {
    MyPageResponseDTO findByUserId(int userId);
    void updateMyPage(MyPageRequestDTO myPageRequestDTO);
    List<FarmResponseDTO> getTimeLapseDTOList(@RequestParam("userId") int userId);
}
