package com.nova.backend.payment.service.pg;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.payment.entity.PaymentMethod;

public interface PaymentGateway {
    PaymentMethod getMethod();
    void approve(String token, OrderEntity order);
}

