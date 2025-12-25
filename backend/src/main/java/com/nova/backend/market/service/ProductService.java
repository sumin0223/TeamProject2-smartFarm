package com.nova.backend.market.service;

import com.nova.backend.market.dto.ProductDetailResponse;
import com.nova.backend.market.dto.ProductListResponse;
import com.nova.backend.market.entity.ProductCategory;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductListResponse> getProducts(
            ProductCategory category,
            String keyword,
            Pageable pageable
    ) {
        Page<ProductEntity> products;

        if (category != null && keyword != null) {
            products = productRepository.findByCategoryAndNameContainingIgnoreCase(category, keyword, pageable);
        } else if (category != null) {
            products = productRepository.findByCategory(category, pageable);
        } else if (keyword != null) {
            products = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(this::toListDto);
    }

    public ProductDetailResponse getProduct(Long productId) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));

        return toDetailDto(product);
    }

    private ProductListResponse toListDto(ProductEntity p) {
        return new ProductListResponse(
                p.getProductId(),
                p.getCategory(),
                p.getName(),
                p.getPrice(),
                p.getUnit(),
                p.getImageUrl(),
                p.getStock()
        );
    }

    private ProductDetailResponse toDetailDto(ProductEntity p) {
        return new ProductDetailResponse(
                p.getProductId(),
                p.getCategory(),
                p.getName(),
                p.getFarmName(),
                p.getSystemType(),
                p.getPlant(),
                p.getStage(),
                p.getDays(),
                p.getPrice(),
                p.getUnit(),
                p.getStock(),
                p.getDescription(),
                p.getSpecs()
        );
    }
}
