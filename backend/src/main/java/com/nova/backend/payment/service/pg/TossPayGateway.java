package com.nova.backend.payment.service.pg;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TossPayGateway implements PaymentGateway {

    @Override
    public PaymentMethod getMethod() {
        return PaymentMethod.TOSSPAY;
    }

    @Override
    public void approve(String paymentKey, OrderEntity order) {
        // TODO: 토스 결제 승인 API 호출
        // amount / orderId 검증 필수
    }
}

