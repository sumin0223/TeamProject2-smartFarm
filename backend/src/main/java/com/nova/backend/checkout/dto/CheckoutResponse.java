package com.nova.backend.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CheckoutResponse {
    private Long orderId;
    private String redirectUrl;
}


