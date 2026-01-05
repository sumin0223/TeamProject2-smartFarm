package com.nova.backend.market.dto;

import com.nova.backend.market.entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductDetailResponseDTO {
    private Long productId;
    private ProductCategory category;
    private String name;
    private String farmName;
    private String systemType;
    private String plant;
    private String stage;
    private Integer days;
    private BigDecimal price;
    private String unit;
    private String imageUrl;
    private int stock;
    private String description;
    private String specs;
}
