package com.nova.backend.payment.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum PaymentMethod {

    KAKAOPAY("kakaopay"),
    TOSSPAY("tosspay");

    @JsonValue
    private final String value;

    PaymentMethod(String value) {
        this.value = value;
    }

    /**
     * URL path 변수(pg) → PaymentMethod 변환
     * ex) "kakao" / "kakaopay" / "KAKAOPAY"
     */
    public static PaymentMethod from(String pg) {
        for (PaymentMethod method : values()) {
            if (
                    method.name().equalsIgnoreCase(pg)
                            || method.value.equalsIgnoreCase(pg)
                            || pg.equalsIgnoreCase("kakao") && method == KAKAOPAY
                            || pg.equalsIgnoreCase("toss") && method == TOSSPAY
            ) {
                return method;
            }
        }
        throw new IllegalArgumentException("지원하지 않는 결제수단: " + pg);
    }
}