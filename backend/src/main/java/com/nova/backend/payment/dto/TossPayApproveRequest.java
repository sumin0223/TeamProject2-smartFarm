package com.nova.backend.payment.dto;

import lombok.Builder;
import lombok.Getter;

//토스는 Ready 단계 없이
//프론트에서 paymentKey 받음
//백엔드는 승인만 처리

@Getter
@Builder
public class TossPayApproveRequest {
    private String paymentKey;
    private String orderId;
    private int amount;
}

