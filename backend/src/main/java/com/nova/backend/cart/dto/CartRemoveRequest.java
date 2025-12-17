package com.nova.backend.cart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRemoveRequest {
    private Long userId;
    private Long productId;
}

