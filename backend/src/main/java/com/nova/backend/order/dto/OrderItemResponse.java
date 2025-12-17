package com.nova.backend.order.dto;

import com.nova.backend.order.entity.OrderItemEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemResponse {

    private Long id;          // productId → 프론트 id
    private String name;
    private int price;
    private int quantity;
    private String image;
    private String category;
    private String description;

    public static OrderItemResponse from(OrderItemEntity entity) {
        return OrderItemResponse.builder()
                .id(entity.getProductId())
                .name(entity.getName())
                .price(entity.getPrice())
                .quantity(entity.getQuantity())
                .image(entity.getImage())
                .category(entity.getCategory())
                .description(entity.getDescription())
                .build();
    }
}

