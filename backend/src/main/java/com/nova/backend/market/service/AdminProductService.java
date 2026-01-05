package com.nova.backend.market.service;

import com.nova.backend.market.dto.AdminProductCreateRequestDTO;
import com.nova.backend.market.dto.AdminProductUpdateRequestDTO;
import com.nova.backend.market.dto.AdminProductResponseDTO;

import java.util.List;

public interface AdminProductService {

    AdminProductResponseDTO createProduct(AdminProductCreateRequestDTO request);

    List<AdminProductResponseDTO> getAllProducts();

    AdminProductResponseDTO getProductById(Long productId);

    AdminProductResponseDTO updateProduct(Long productId, AdminProductUpdateRequestDTO request);

    void deleteProduct(Long productId);
}

