package com.nova.backend.market.dto;

import com.nova.backend.market.entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductListResponse {
    private Long productId;
    private ProductCategory category;
    private String name;
    private int price;
    private String unit;
    private String imageUrl;
    private int stock;
}
