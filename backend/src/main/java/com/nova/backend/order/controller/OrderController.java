//package com.nova.backend.order.controller;
//
//import com.nova.backend.order.dto.*;
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.order.entity.OrderStatus;
//import com.nova.backend.order.service.OrderService;
//import com.nova.backend.payment.service.PaymentService;
//import com.nova.backend.security.CustomUserDetails;
//import com.nova.backend.user.entity.UsersEntity;
//import com.siot.IamportRestClient.exception.IamportResponseException;
//import io.swagger.v3.oas.annotations.Operation;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//import retrofit2.Response;
//
//import java.io.IOException;
//import java.util.List;

package com.nova.backend.order.controller;

import com.nova.backend.order.dto.*;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.service.OrderService;
import com.nova.backend.payment.service.PaymentService;
import com.nova.backend.security.CustomUserDetails;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    // 주문 생성
    @PostMapping
    public OrderResponseDTO createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid OrderRequestDTO request
    ) {
        UsersEntity user = userDetails.getUser();

        OrderEntity order = orderService.createOrder(user, request);

        return OrderResponseDTO.from(order, "주문 성공");
    }


    // 주문목록 들을 프론트로 보내기
    //리스트가 아니라 페이지사용해야하나? = > 리스트로도 잘됨
    @GetMapping("/orders")
    public List<OrderResponseDTO> getOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UsersEntity user = userDetails.getUser();
        return orderService.getOrders(user);
    }


    // orderUid로 주문 개별데이터 프론트로 보내기
    @GetMapping("/{orderUid}")
    public ResponseEntity<OrderResponseDTO> findOrder(@PathVariable String orderUid) {

        OrderResponseDTO orderResponseDTO = orderService.findOrder(orderUid);

        if (orderResponseDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(orderResponseDTO);
    }





    // orderUid를 기준으로 주문 프론트로 보내기
//    @GetMapping("/{orderUid}")
//    public OrderResponse getOrder(@AuthenticationPrincipal CustomUserDetails userDetails) {
//        UsersEntity user = userDetails.getUser();
//        return orderService.getOrder(orderUid);
//    }

    // orderUid로 주문내역 불러오기
//    @GetMapping("/order")
//    public String order(@RequestParam(name = "message", required = false) String message,
//                        @RequestParam(name = "orderUid", required = false) String id,
//                        Model model) {
//
//        model.addAttribute("message", message);
//        model.addAttribute("orderUid", id);
//
//        return "order";
//    }



//    private final OrderService orderService;
//    private final PaymentService paymentService;
//
//    /* =========================
//       주문 페이지 (뷰)
//       ========================= */
//    @GetMapping("/order")
//    public String orderPage(@RequestParam(name = "message", required = false) String message,
//                            @RequestParam(name = "orderUid", required = false) String orderUid,
//                            Model model) {
//
//        model.addAttribute("message", message);
//        model.addAttribute("orderUid", orderUid);
//
//        return "order"; // Thymeleaf / JSP 뷰 이름
//    }
//
//    /* =========================
//       자동 주문
//       ========================= */
//    @PostMapping("/order")
//    public String autoOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
//                            RedirectAttributes redirectAttributes) {
//
//        UsersEntity user = userDetails.getUser();
//        OrderEntity orderEntity = orderService.autoOrder(user);
//
//        String message = "주문 실패";
//        String orderUid = null;
//        if(orderEntity != null) {
//            message = "주문 성공";
//            orderUid = orderEntity.getOrderUid();
//        }
//
//        redirectAttributes.addAttribute("message", message);
//        redirectAttributes.addAttribute("orderUid", orderUid);
//
//        return "redirect:/api/v1/orders/order";
//    }


}






//    /* =========================
//       결제 사전 검증
//       ========================= */
//    @Operation(summary = "결제 사전 검증")
//    @PostMapping("/preparation")
//    public Response<PreparationResponse> prepareValid(
//            @Valid @RequestBody PreparationRequest preparationRequest,
//            @AuthenticationPrincipal CustomUserDetails userDetails
//    ) throws IamportResponseException, IOException {
//
//        log.info("사용자 {} 결제 사전 검증 시도, merchantUid: {}",
//                userDetails.getUsername(), preparationRequest.getMerchantUid());
//
//        PreparationResponse response = paymentService.prepareValid(preparationRequest);
//        return Response.success(response);
//    }
//
//    /* =========================
//       결제 사후 검증
//       ========================= */
//    @Operation(summary = "결제 사후 검증")
//    @PostMapping("/verification")
//    public Response<MessageResponse> postVerification(
//            @Valid @RequestBody PostVerificationRequest postVerificationRequest,
//            @AuthenticationPrincipal CustomUserDetails userDetails
//    ) throws IamportResponseException, IOException {
//
//        log.info("사용자 {} 결제 사후 검증 시도, impUid: {}",
//                userDetails.getUsername(), postVerificationRequest.getImpUid());
//
//        MessageResponse messageResponse = orderService.postVerification(postVerificationRequest);
//        return Response.success(messageResponse);
//    }




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
