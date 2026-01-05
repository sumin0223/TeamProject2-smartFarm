package com.nova.backend.order.dto;

import com.nova.backend.order.entity.OrderEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponseDTO {


    private String orderUid;

    private Long id;
    private List<OrderItemResponseDTO> items;
    private BigDecimal totalPrice;

    private String status;
    private String paymentStatus;
    private String paymentMethod;

    private String trackingNumber;

    private String deliveryAddress;
    private String recipientName;
    private String phoneNumber;
    private String message;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime estimatedDelivery;

    private String refundReason;
    private LocalDateTime refundRequestedAt;

    public static OrderResponseDTO from(OrderEntity entity, String message) {
        return OrderResponseDTO.builder()
                .orderUid(entity.getOrderUid())
                .id(entity.getOrderId())
                .items(
                        entity.getItems().stream()
                                .map(OrderItemResponseDTO::from)
                                .toList()
                )
                .totalPrice(entity.getOrderTotalPrice())
                .status(entity.getStatus().getValue())
                .paymentStatus(entity.getPaymentStatus().getValue())
                .paymentMethod(
                        entity.getPaymentMethod() != null
                                ? entity.getPaymentMethod().getValue()
                                : null
                )
                .trackingNumber(entity.getTrackingNumber())
                .deliveryAddress(entity.getDeliveryAddress())
                .recipientName(entity.getRecipientName())
                .phoneNumber(entity.getPhoneNumber())
                .message(message)
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
//import com.nova.backend.market.dto.CartItemResponse;
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


