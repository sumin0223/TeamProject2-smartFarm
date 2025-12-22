package com.nova.backend.order.dto;

import com.nova.backend.cart.dto.CartItemResponse;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.entity.OrderStatus;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {

    private Long id; // orderId → id
    private List<OrderItemResponse> items;
    private int totalPrice;

    private String status;
    private String paymentStatus;
    private String paymentMethod;

    private String trackingNumber;
    private String deliveryAddress;
    private String phoneNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime estimatedDelivery;

    private String refundReason;
    private LocalDateTime refundRequestedAt;

    public static OrderResponse from(OrderEntity entity) {
        return OrderResponse.builder()
                .id(entity.getOrderId())
                .items(
                        entity.getItems().stream()
                                .map(OrderItemResponse::from)
                                .toList()
                )
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus().getValue())
                .paymentStatus(entity.getPaymentStatus().getValue())
                .paymentMethod(
                        entity.getPaymentMethod() != null
                                ? entity.getPaymentMethod().getValue()
                                : null
                )
                .trackingNumber(entity.getTrackingNumber())
                .deliveryAddress(entity.getDeliveryAddress())
                .phoneNumber(entity.getPhoneNumber())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .estimatedDelivery(entity.getEstimatedDelivery())
                .refundReason(entity.getRefundReason())
                .refundRequestedAt(entity.getRefundRequestedAt())
                .build();
    }
}









//
//package com.nova.backend.order.dto;
//
//import com.nova.backend.cart.dto.CartItemResponse;
//import com.nova.backend.order.entity.OrderStatus;
//import com.nova.backend.order.entity.PaymentMethod;
//import com.nova.backend.order.entity.PaymentStatus;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Getter
//@AllArgsConstructor
//public class OrderResponse {
//    private Long id;
//    private List<CartItemResponse> items;
//    private int totalPrice;
//    private OrderStatus status;
//    private PaymentStatus paymentStatus;
//    private PaymentMethod paymentMethod;
//    private String trackingNumber;
//    private String deliveryAddress;
//    private String phoneNumber;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//    private LocalDateTime estimatedDelivery;
//    private String refundReason;
//    private LocalDateTime refundRequestedAt;
//}


