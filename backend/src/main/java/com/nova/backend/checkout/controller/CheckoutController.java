package com.nova.backend.checkout.controller;

import com.nova.backend.checkout.dto.CheckoutRequest;
import com.nova.backend.checkout.dto.CheckoutResponse;
import com.nova.backend.order.service.OrderService;
import com.nova.backend.payment.service.KakaoPayService;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/checkout")
public class CheckoutController {

    private final OrderService orderService;
    private final KakaoPayService kakaoPayService;

    /**
     * 🟢 결제 시작 (주문 생성 → 카카오페이 Ready)
     */
    @PostMapping("/direct")
    public CheckoutResponse checkout(
            @RequestBody CheckoutRequest request
    ) {
        // 1️⃣ 주문 생성
        Long orderId = orderService.createOrder(
                null,
                request.getItems(),
                request.getDeliveryAddress(),
                request.getPhoneNumber(),
                request.getPaymentMethod()
        );

        // 2️⃣ 카카오페이 Ready → redirectUrl 반환
        String redirectUrl = kakaoPayService.ready(orderId);

        // 3️⃣ 프론트는 redirectUrl로 이동
        return new CheckoutResponse(orderId, redirectUrl);
    }

    /**
     * 🟢 결제 시작 (주문 생성 → 카카오페이 Ready)
     */
    @PostMapping("/cart")
    public CheckoutResponse checkout2(
            @RequestBody CheckoutRequest request
    ) {
        // 1️⃣ 주문 생성
        Long orderId = orderService.createOrder(
               null,
                request.getItems(),
                request.getDeliveryAddress(),
                request.getPhoneNumber(),
                request.getPaymentMethod()
        );

        // 2️⃣ 카카오페이 Ready → redirectUrl 반환
        String redirectUrl = kakaoPayService.ready(orderId);

        // 3️⃣ 프론트는 redirectUrl로 이동
        return new CheckoutResponse(orderId, redirectUrl);
    }
}


//package com.nova.backend.checkout.controller;
//
//import com.nova.backend.order.service.OrderService;
//import com.nova.backend.payment.service.KakaoPayService;
//import com.nova.backend.user.entity.UsersEntity;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import com.nova.backend.checkout.dto.CheckoutRequest;
//import com.nova.backend.checkout.dto.CheckoutResponse;
////import com.nova.backend.payment.service.PaymentService;
//import org.springframework.web.bind.annotation.*;
//
////사용자 결제시작
//
////CheckoutController
//// → OrderService.createOrder
//// → PaymentService.ready(orderId, method)
//// → KakaoPayClient.ready
//// → redirectUrl 반환
//// → 프론트 → 카카오페이
//
//
//
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/checkout")
//public class CheckoutController {
//
//    private final OrderService orderService;
//    //private final PaymentService paymentService;
//    private final KakaoPayService kakaoPayService;
//
//
//    //바로주문
//    @PostMapping("/direct")
//    public CheckoutResponse createDirectOrder(
//            @RequestBody CheckoutRequest request,
//            @AuthenticationPrincipal UsersEntity user
//    ) {
//        Long orderId = orderService.createOrder(
//                user,                           // OrderEntity 구조상 user 없으면 주문 저장 자체가 불가능
//                request.getItems(),
//                request.getDeliveryAddress(),
//                request.getPhoneNumber(),
//                request.getPaymentMethod()
//        );
//
//        String redirectUrl =
//                kakaoPayService.ready(orderId, request.getPaymentMethod());
//
//        return new CheckoutResponse(orderId, redirectUrl);
//    }
//
//
//
//    //장바구니에서 주문
//    @Transactional
//    @PostMapping("/cart")
//    public CheckoutResponse createOrderFromCart(
//            @RequestBody CheckoutRequest request,
//            @AuthenticationPrincipal UsersEntity user
//    ) {
//        Long orderId = orderService.createOrderFromCart(
//                user,
//                request.getDeliveryAddress(),
//                request.getPhoneNumber(),
//                request.getPaymentMethod()
//        );
//
//        String redirectUrl =kakaoPayService.ready(orderId);
//                //kakaoPayService.ready(orderId, request.getPaymentMethod());
//
//        return new CheckoutResponse(orderId, redirectUrl);
//    }
//
//}
//
//
