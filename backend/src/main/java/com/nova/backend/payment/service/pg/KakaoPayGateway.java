package com.nova.backend.payment.service.pg;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KakaoPayGateway implements PaymentGateway {

    @Override
    public PaymentMethod getMethod() {
        return PaymentMethod.KAKAOPAY;
    }

    @Override
    public void approve(String pgToken, OrderEntity order) {
        // TODO: 카카오페이 approve API 호출
        // 1️⃣ tid 가져오기
        // 2️⃣ amount 검증
        // 3️⃣ 실패 시 예외 throw
    }
}

