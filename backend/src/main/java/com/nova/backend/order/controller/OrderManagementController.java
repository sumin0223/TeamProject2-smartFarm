package com.nova.backend.order.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// 관리자 주문 현황 조회, 배송현황 관리, 주문 상태 추적+변경
// 관리자 주문내역조회 + 주문상태관리 전용
@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class OrderManagementController {

//    private final OrderService orderService;
//
//    /**
//     * =========================================================
//     * 관리자 - 전체 주문 목록 조회
//     * =========================================================
//     */
//    @GetMapping
//    public List<OrderResponse> getAllOrders() {
//        return orderService.getAllOrders().stream()
//                .map(OrderResponse::from)
//                .toList();
//    }
//
//    /**
//     * =========================================================
//     * 관리자 - 주문 상태 변경
//     * =========================================================
//     */
//    @PatchMapping("/{orderId}/status")
//    public void updateOrderStatus(
//            @PathVariable Long orderId,
//            @RequestParam OrderStatus status
//    ) {
//        orderService.updateOrderStatus(orderId, status);
//    }
//
//    /**
//     * =========================================================
//     * 관리자 - 운송장 번호 등록
//     * =========================================================
//     */
//    @PatchMapping("/{orderId}/tracking")
//    public void updateTrackingNumber(
//            @PathVariable Long orderId,
//            @RequestParam String trackingNumber
//    ) {
//        orderService.updateTrackingNumber(orderId, trackingNumber);
//    }
//
//    /**
//     * =========================================================
//     * 관리자 - 환불 승인
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/refund/approve")
//    public void approveRefund(@PathVariable Long orderId) {
//        orderService.approveRefund(orderId);
//    }

}
//package com.nova.backend.order.controller;
//
//import com.nova.backend.order.dto.OrderResponse;
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.order.entity.OrderStatus;
//import com.nova.backend.order.service.OrderService;
//import com.nova.backend.security.CustomUserDetails;
//import com.nova.backend.user.entity.UsersEntity;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//        import java.util.List;

//@RestController
//@RequestMapping("/api/orders")
//@RequiredArgsConstructor
//public class OrderController {
//
//    private final OrderService orderService;
//
//    @GetMapping("/{orderId}")
//    public OrderResponse getOrder(@PathVariable Long orderId) {
//        OrderEntity order = orderService.getOrderById(orderId);
//        return OrderResponse.from(order);
//    }
//
//    @GetMapping("/user")
//    public List<OrderResponse> getUserOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
//        UsersEntity user = userDetails.getUser();
//        return orderService.getOrdersByUser(user).stream()
//                .map(OrderResponse::from)
//                .toList();
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
//    @PostMapping("/{orderId}/cancel")
//    public void cancelOrder(@PathVariable Long orderId,
//                            @AuthenticationPrincipal CustomUserDetails userDetails) {
//        UsersEntity user = userDetails.getUser();
//        orderService.cancelOrder(user, orderId);
//    }
//
//    @PostMapping("/{orderId}/refund/request")
//    public void requestRefund(@PathVariable Long orderId,
//                              @RequestParam String reason) {
//        orderService.requestRefund(orderId, reason);
//    }
//
//    @PostMapping("/{orderId}/refund/approve")
//    public void approveRefund(@PathVariable Long orderId) {
//        orderService.approveRefund(orderId);
//    }
//
//    @PostMapping("/{orderId}/tracking")
//    public void updateTrackingNumber(@PathVariable Long orderId, @RequestParam String trackingNumber) {
//        orderService.updateTrackingNumber(orderId, trackingNumber);
//    }
//}


//package com.nova.backend.order.controller;
//
//import com.nova.backend.order.dto.OrderResponse;
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.order.entity.OrderStatus;
//import com.nova.backend.order.service.OrderService;
//import com.nova.backend.security.CustomUserDetails;
//import com.nova.backend.user.entity.UsersEntity;
//import com.nova.backend.user.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/orders")
//@RequiredArgsConstructor
//public class OrderController {
//
//    private final OrderService orderService;
//    private final UserRepository userRepository;
//
//    /**
//     * =========================================================
//     * 단건 주문 조회 (주문 상세)
//     * =========================================================
//     */
//    @GetMapping("/{orderId}")
//    public OrderResponse getOrder(@PathVariable Long orderId) {
//        OrderEntity order = orderService.getOrderById(orderId)
//                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
//        return OrderResponse.from(order);
//    }
//
//    /**
//     * =========================================================
//     * 사용자 주문 목록 조회
//     * =========================================================
//     */
//    @GetMapping("/user")
//    public List<OrderResponse> getUserOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
//        UsersEntity user = userDetails.getUser();
//        return orderService.getOrdersByUser(user).stream()
//                .map(OrderResponse::from)
//                .toList();
//    }
//
//    /**
//     * =========================================================
//     * 주문 상태 변경 (관리자/시스템용)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/status")
//    public void updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
//        orderService.updateOrderStatus(orderId, status);
//    }
//
//    /**
//     * =========================================================
//     * 주문 확정 (사용자)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/confirm")
//    public void confirmOrder(@PathVariable Long orderId,
//                             @AuthenticationPrincipal CustomUserDetails userDetails) {
//        UsersEntity user = userDetails.getUser();
//        orderService.confirmOrder(user, orderId);
//    }
//
//    /**
//     * =========================================================
//     * 주문 취소 (사용자)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/cancel")
//    public void cancelOrder(@PathVariable Long orderId,
//                            @AuthenticationPrincipal CustomUserDetails userDetails) {
//        UsersEntity user = userDetails.getUser();
//        orderService.cancelOrder(user, orderId);
//    }
//
//    /**
//     * =========================================================
//     * 환불 요청 / 승인 (사용자 & 관리자)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/refund/request")
//    public void requestRefund(@PathVariable Long orderId,
//                              @AuthenticationPrincipal CustomUserDetails userDetails,
//                              @RequestParam String reason) {
//        UsersEntity user = userDetails.getUser();
//        orderService.requestRefund(user, orderId, reason);
//    }
//
//    @PostMapping("/{orderId}/refund/approve")
//    public void approveRefund(@PathVariable Long orderId) {
//        orderService.approveRefund(orderId);
//    }
//
//    /**
//     * =========================================================
//     * 운송장 번호 등록 / 수정 (관리자)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/tracking")
//    public void updateTrackingNumber(@PathVariable Long orderId,
//                                     @RequestParam String trackingNumber) {
//        orderService.updateTrackingNumber(orderId, trackingNumber);
//    }
//}
//


////사용자 주문기록 조회 주문 상태 추적
////사용자 주문기록 조회 + 사용자가 상태관리 전용
//
//@RestController
//@RequestMapping("/orders")
//@RequiredArgsConstructor
//public class OrderController {
//
//    private final OrderService orderService;
//    private final CartItemService cartItemService;
//    private final UserRepository userRepository;
//
//    /**
//     * =========================================================
//     * 사용자 주문 단건 조회
//     * =========================================================
//     */
//    @GetMapping("/{orderId}")
//    public OrderResponse getOrder(@PathVariable Long orderId) {
//        return OrderResponse.from(orderService.getOrderById(orderId));
//    }
//
//
//    /**
//     * =========================================================
//     * 사용자 주문 목록 조회
//     * =========================================================
//     */
//    @GetMapping("/user/{userId}")
//    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {
//
//        UsersEntity user = userRepository.findByUserId(userId);
//                //.orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));
//
//        return orderService.getOrdersByUser(user).stream()
//                .map(OrderResponse::from)
//                .toList();
//    }
//
//
//    /**
//     * =========================================================
//     * 사용자 주문 확정 (구매 확정 버튼)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/confirm")
//    public void confirmOrder(@PathVariable Long orderId) {
//        orderService.confirmOrder(orderId);
//    }
//
//
//    /**
//     * =========================================================
//     * 환불 요청 (유저)
//     * =========================================================
//     */
//    @PostMapping("/{orderId}/refund")
//    public void requestRefund(
//            @PathVariable Long orderId,
//            @RequestParam String reason
//    ) {
//        orderService.requestRefund(orderId, reason);
//    }
//
//    @PostMapping("/cancelOrder/{orderId}")
//    public CheckoutResponse cancelOrder(
//            @PathVariable Long orderId,
//            @AuthenticationPrincipal CustomUserDetails userDetails
//    ) {
//        UsersEntity user = userDetails.getUser();
//        return orderService.cancelOrder(user, orderId);
//    }
//
//
//    /**
//     * =========================================================
//     * 주문 기록 생성
//     * =========================================================
//     */
//    @PostMapping("/create")
//    public OrderEntity createOrder(@RequestParam Long userId,
//                                   @RequestParam String address,
//                                   @RequestParam String phone,
//                                   @RequestParam PaymentMethod method) {
//        List<CartItemResponse> cartItems = cartItemService.getCartItems(userId);
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
//
//}
//
//
