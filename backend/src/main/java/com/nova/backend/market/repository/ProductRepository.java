package com.nova.backend.market.repository;

import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.entity.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    // 기본 Query Method만 사용 (Hibernate 종속 없음)
    Page<ProductEntity> findByCategory(ProductCategory category, Pageable pageable);

    Page<ProductEntity> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<ProductEntity> findByCategoryAndNameContainingIgnoreCase(
            ProductCategory category, String keyword, Pageable pageable
    );
}


