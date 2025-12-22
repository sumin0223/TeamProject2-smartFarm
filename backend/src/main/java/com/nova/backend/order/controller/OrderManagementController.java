package com.nova.backend.order.controller;

import com.nova.backend.order.dto.OrderResponse;
import com.nova.backend.order.entity.OrderStatus;
import com.nova.backend.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 관리자 주문 현황 조회, 배송현황 관리, 주문 상태 추적+변경
// 관리자 주문내역조회 + 주문상태관리 전용
@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class OrderManagementController {

    private final OrderService orderService;

    /**
     * =========================================================
     * 관리자 - 전체 주문 목록 조회
     * =========================================================
     */
    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders().stream()
                .map(OrderResponse::from)
                .toList();
    }

    /**
     * =========================================================
     * 관리자 - 주문 상태 변경
     * =========================================================
     */
    @PatchMapping("/{orderId}/status")
    public void updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        orderService.updateOrderStatus(orderId, status);
    }

    /**
     * =========================================================
     * 관리자 - 운송장 번호 등록
     * =========================================================
     */
    @PatchMapping("/{orderId}/tracking")
    public void updateTrackingNumber(
            @PathVariable Long orderId,
            @RequestParam String trackingNumber
    ) {
        orderService.updateTrackingNumber(orderId, trackingNumber);
    }

    /**
     * =========================================================
     * 관리자 - 환불 승인
     * =========================================================
     */
    @PostMapping("/{orderId}/refund/approve")
    public void approveRefund(@PathVariable Long orderId) {
        orderService.approveRefund(orderId);
    }

}
