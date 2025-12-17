package com.nova.backend.market.service;

import com.nova.backend.market.dto.AdminProductCreateRequest;
import com.nova.backend.market.dto.AdminProductUpdateRequest;
import com.nova.backend.market.dto.AdminProductResponse;

import java.util.List;

public interface AdminProductService {

    AdminProductResponse createProduct(AdminProductCreateRequest request);

    List<AdminProductResponse> getAllProducts();

    AdminProductResponse getProductById(Long productId);

    AdminProductResponse updateProduct(Long productId, AdminProductUpdateRequest request);

    void deleteProduct(Long productId);
}

