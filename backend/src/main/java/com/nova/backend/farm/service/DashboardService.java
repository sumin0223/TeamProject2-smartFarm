package com.nova.backend.farm.service;

import com.nova.backend.farm.dto.DashboardRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;

import java.util.List;

public interface DashboardService {
    DashboardRequestDTO getDashboard(Long farmId);
}
