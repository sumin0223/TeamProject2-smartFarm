package com.nova.backend.cart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartUpdateRequest {
    private Long cartItemId;
    private int quantity;
}

