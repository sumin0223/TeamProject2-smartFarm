package com.nova.backend.order.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum OrderNotificationType {

    //이거 아래거에서 2개는 왜 사용안하지?
    PENDING("pending"),
    PROCESSING("processing"),
    SHIPPING("shipping"),
    DELIVERED("delivered"),
    CONFIRMED("confirmed"),
    CANCELLED("cancelled"),
    REFUND_REQUESTED("refund_requested"),
    REFUNDED("refunded");

    @JsonValue
    private final String value;

    OrderNotificationType(String value) {
        this.value = value;
    }
}
