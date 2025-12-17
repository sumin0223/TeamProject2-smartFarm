package com.nova.backend.cart.dto;

import com.nova.backend.cart.entity.CartItemEntity;
import lombok.Getter;

@Getter
public class CartItemResponse {

    private final Long cartItemId;
    private final Long productId;
    private final String productName;
    private final int quantity;
    private final int price;

    public CartItemResponse(CartItemEntity entity) {
        this.cartItemId = entity.getCartItemId();
        this.productId = entity.getProduct().getProductId();
        this.productName = entity.getProduct().getName();
        this.quantity = entity.getQuantity();
        this.price = entity.getProduct().getPrice();
    }
}
