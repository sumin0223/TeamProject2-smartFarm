package com.nova.backend.order.controller;

import com.nova.backend.order.dto.OrderResponse;
import com.nova.backend.order.entity.OrderStatus;
import com.nova.backend.order.service.OrderService;
import com.nova.backend.user.entity.UsersEntity;

import com.nova.backend.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UsersRepository userRepository;

    /**
     * =========================================================
     * 사용자 주문 단건 조회
     * =========================================================
     */
    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable Long orderId) {
        return OrderResponse.from(orderService.getOrderById(orderId));
    }

    /**
     * =========================================================
     * 사용자 주문 목록 조회
     * =========================================================
     */
    @GetMapping("/user/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {

        UsersEntity user = userRepository.findByUserId(userId);
                //.orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        return orderService.getOrdersByUser(user).stream()
                .map(OrderResponse::from)
                .toList();
    }


    /**
     * =========================================================
     * 사용자 주문 확정 (구매 확정 버튼)
     * =========================================================
     */
    @PostMapping("/{orderId}/confirm")
    public void confirmOrder(@PathVariable Long orderId) {
        orderService.confirmOrder(orderId);
    }



    /**
     * =========================================================
     * 환불 요청 (유저)
     * =========================================================
     */
    @PostMapping("/{orderId}/refund")
    public void requestRefund(
            @PathVariable Long orderId,
            @RequestParam String reason
    ) {
        orderService.requestRefund(orderId, reason);
    }
}


//package com.nova.backend.order.controller;
//import com.nova.backend.cart.dto.CartItemResponse;
//import com.nova.backend.cart.entity.CartItemEntity;
//import com.nova.backend.cart.service.CartService;
//import com.nova.backend.order.dto.OrderRequest;
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.order.entity.OrderStatus;
//import com.nova.backend.order.entity.PaymentMethod;
//import com.nova.backend.order.service.OrderService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;








//
//import java.util.List;
//
////사용자 주문기록 조회 주문 상태 추적
////사용자 주문기록 조회 + 사용자가 상태관리 전용
//@RestController
//@RequestMapping("/orders")
//@RequiredArgsConstructor
//public class OrderController {
//    private final OrderService orderService;
//    private final CartService cartService;
//
//    @PostMapping("/create")
//    public OrderEntity createOrder(@RequestParam Long userId,
//                                   @RequestParam String address,
//                                   @RequestParam String phone,
//                                   @RequestParam PaymentMethod method) {
//        List<CartItemResponse> cartItems = cartService.getCart(userId);
//        return orderService.createOrder(userId, cartItems, address, phone, method);
//    }
//
//    @PostMapping("/{orderId}/status")
//    public void updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
//        orderService.updateOrderStatus(orderId, status);
//    }
//
//    @PostMapping("/{orderId}/confirm")
//    public void confirmOrder(@PathVariable Long orderId) {
//        orderService.confirmOrder(orderId);
//    }
//
//    @PostMapping("/{orderId}/tracking")
//    public void updateTrackingNumber(@PathVariable Long orderId, @RequestParam String trackingNumber) {
//        orderService.updateTrackingNumber(orderId, trackingNumber);
//    }
//
//    @PostMapping("/{orderId}/refund/request")
//    public void requestRefund(@PathVariable Long orderId, @RequestParam String reason) {
//        orderService.requestRefund(orderId, reason);
//    }
//
//    @PostMapping("/{orderId}/refund/approve")
//    public void approveRefund(@PathVariable Long orderId) {
//        orderService.approveRefund(orderId);
//    }
//
//    @GetMapping("/{orderId}")
//    public OrderEntity getOrderById(@PathVariable Long orderId) {
//        return orderService.getOrderById(orderId);
//    }
//}
