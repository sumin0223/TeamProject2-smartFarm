package com.nova.backend.market.controller;

import com.nova.backend.market.dto.ProductDetailResponse;
import com.nova.backend.market.dto.ProductListResponse;
import com.nova.backend.market.entity.ProductCategory;
import com.nova.backend.market.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    /*** 로그인한 사용자가 상품목록 조회(GET) ***/
    @GetMapping
    public Page<ProductListResponse> getProducts(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        return productService.getProducts(category, keyword, pageable);
    }

    /*** 로그인한 사용자가 상품 상세정보 조회(GET) ***/
    @GetMapping("/{productId}")
    public ProductDetailResponse getProduct(@PathVariable Long productId) {
        return productService.getProduct(productId);
    }
}
