package com.nova.backend.cart.dto;

import com.nova.backend.cart.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "장바구니 상품 응답")
public class CartItemResponse {

    private Long cartItemId;
    private Long productId;
    private String productName;
    private ProductCategory category;
    private BigDecimal price;
    private Integer quantity;
    private String unit;
    private String image;
    private List<String> specs;
    private LocalDateTime createdAt;

    public CartItemResponse(CartItemEntity entity) {
        this.cartItemId = entity.getCartItemId();
        this.productId = entity.getProduct().getProductId();
        this.productName = entity.getProduct().getName();
        this.quantity = entity.getQuantity();
        this.price = BigDecimal.valueOf(entity.getProduct().getPrice());
    }
}
