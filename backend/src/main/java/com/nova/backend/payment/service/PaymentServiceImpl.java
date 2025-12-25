//package com.nova.backend.payment.service;
//
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.payment.entity.PaymentMethod;
//import com.nova.backend.payment.entity.PaymentStatus;
//import com.nova.backend.order.service.OrderService;
//import com.nova.backend.payment.dto.KakaoPayApproveResponse;
//import com.nova.backend.payment.dto.KakaoPayReadyRequest;
//import com.nova.backend.payment.dto.KakaoPayReadyResponse;
//import com.nova.backend.payment.entity.PaymentEntity;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//
////PaymentServiceImpl – 결제 승인 진입점
//@Service
//@RequiredArgsConstructor
//public class PaymentServiceImpl implements PaymentService {
//
//    private final KakaoPayService kakaoPayService;
//    private final TossPayService tossPayService;
//    private final OrderService orderService;
//
//
//
//    @Transactional
//    public String kakaoReady(Long orderId) {
//
//        OrderEntity order = orderRepository.findById(orderId)
//                .orElseThrow();
//
//        if (order.isPaid()) {
//            throw new IllegalStateException("이미 결제됨");
//        }
//
//        // Payment READY 생성
//        PaymentEntity payment = PaymentEntity.builder()
//                .order(order)
//                .method(PaymentMethod.KAKAOPAY)
//                .amount(order.getTotalPrice())
//                .status(PaymentStatus.READY)
//                .build();
//
//        paymentRepository.save(payment);
//
//        KakaoPayReadyRequest request = KakaoPayReadyRequest.builder()
//                .partner_order_id(order.getId().toString())
//                .partner_user_id(order.getUser().getId().toString())
//                .item_name(order.getOrderName())
//                .quantity(order.getTotalQuantity())
//                .total_amount(order.getTotalPrice())
//                .approval_url("https://api.server/pay/kakao/success?orderId=" + orderId)
//                .fail_url("https://api.server/pay/kakao/fail?orderId=" + orderId)
//                .cancel_url("https://api.server/pay/kakao/cancel?orderId=" + orderId)
//                .build();
//
//        KakaoPayReadyResponse response = kakaoPayClient.ready(request);
//
//        payment.approve(response.getTid()); // tid 저장 (상태는 아직 READY)
//
//        return response.getNext_redirect_pc_url();
//    }
//
//
//    @Transactional
//    public void kakaoApprove(String pgToken, Long orderId) {
//
//        PaymentEntity payment = paymentRepository
//                .findByOrderIdAndMethod(orderId, PaymentMethod.KAKAOPAY)
//                .orElseThrow();
//
//        OrderEntity order = payment.getOrder();
//
//        if (payment.getStatus() == PaymentStatus.APPROVED) {
//            return; // 중복 승인 방지
//        }
//
//        KakaoPayApproveResponse response =
//                kakaoPayClient.approve(payment.getTid(), pgToken, order);
//
//        // 💥 금액 검증
//        if (response.getAmount() != order.getTotalPrice()) {
//            throw new IllegalStateException("결제 금액 불일치");
//        }
//
//        payment.approve(payment.getTid());
//        order.markPaid(PaymentMethod.KAKAOPAY);
//    }
//
//
//    /**
//     * 결제 준비 (Checkout 단계)
//     */
//    @Override
//    public String ready(Long orderId, PaymentMethod method) {
//        return switch (method) {
//            case KAKAOPAY -> kakaoPayService.ready(orderId);
//            case TOSSPAY -> tossPayService.ready(orderId);
//        };
//    }
//
//    /**
//     * 결제 승인 (PG → Success Redirect)
//     */
//    @Override
//    @Transactional
//    public void approve(String pgToken, Long orderId, PaymentMethod method) {
//
//        switch (method) {
//            case KAKAOPAY -> kakaoPayService.approve(pgToken, orderId);
//            case TOSSPAY -> tossPayService.approve(pgToken, orderId);
//        }
//
//        // ✅ 공통 결제 성공 처리
//        orderService.markPaymentSuccess(orderId, method);
//    }
//
//    /**
//     * 결제 실패 / 취소
//     */
//    @Override
//    @Transactional
//    public void fail(Long orderId, String reason) {
//        orderService.markPaymentFail(orderId, reason);
//    }
//}
