package com.nova.backend.payment.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum PaymentStatus {

    READY("ready"),
    APPROVED("approved"),
    FAILED("failed"),
    CANCELED("canceled");

    @JsonValue
    private final String value;

    PaymentStatus(String value) {
        this.value = value;
    }
}
