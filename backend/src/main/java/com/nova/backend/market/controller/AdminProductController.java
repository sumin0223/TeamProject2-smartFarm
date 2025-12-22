package com.nova.backend.market.controller;

import com.nova.backend.market.dto.AdminProductCreateRequest;
import com.nova.backend.market.dto.AdminProductUpdateRequest;
import com.nova.backend.market.dto.AdminProductResponse;
import com.nova.backend.market.service.AdminProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductServiceImpl adminProductServiceImpl;

    // TODO: @PreAuthorize("hasRole('ADMIN')") 적용 가능

    /*** 로그인한 관리자가 상품 등록 (POST) ***/
    @PostMapping
    public ResponseEntity<AdminProductResponse> createProduct(
            @RequestBody AdminProductCreateRequest request
    ) {
        AdminProductResponse saved =
                adminProductServiceImpl.createProduct(request);
        return ResponseEntity.ok(saved);
    }

    /*** 로그인한 관리자가 상품 조회(GET) ***/
    @GetMapping
    public ResponseEntity<List<AdminProductResponse>> getAllProducts() {
        return ResponseEntity.ok(
                adminProductServiceImpl.getAllProducts()
        );
    }

    /*** 로그인한 관리자가 상품 단건 조회(GET) ***/
    @GetMapping("/{productId}")
    public ResponseEntity<AdminProductResponse> getProduct(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                adminProductServiceImpl.getProductById(productId)
        );
    }

    /*** 로그인한 관리자가 상품 편집/변경(PUT) ***/
    @PutMapping("/{productId}")
    public ResponseEntity<AdminProductResponse> updateProduct(
            @PathVariable Long productId,
            @RequestBody AdminProductUpdateRequest request
    ) {
        return ResponseEntity.ok(
                adminProductServiceImpl.updateProduct(productId, request)
        );
    }

    /*** 로그인한 관리자가 상품 제거(DELETE) ***/
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId
    ) {
        adminProductServiceImpl.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}
