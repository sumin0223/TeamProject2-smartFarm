package com.nova.backend.checkout.dto;

import com.nova.backend.order.dto.OrderItemRequest;
import com.nova.backend.payment.entity.PaymentMethod;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class CheckoutRequest {

    private List<OrderItemRequest> items;
    private String deliveryAddress;
    private String phoneNumber;
    private PaymentMethod paymentMethod;


}


