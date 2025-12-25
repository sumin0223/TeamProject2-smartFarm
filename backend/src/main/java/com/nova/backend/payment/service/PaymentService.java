//package com.nova.backend.payment.service;
//
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.payment.client.KakaoPayClient;
//import com.nova.backend.payment.entity.PaymentMethod;
//import com.nova.backend.order.repository.OrderRepository;
//import com.nova.backend.payment.dto.KakaoPayApproveResponse;
//import com.nova.backend.payment.dto.KakaoPayReadyRequest;
//import com.nova.backend.payment.dto.KakaoPayReadyResponse;
//import com.nova.backend.payment.entity.PaymentEntity;
//import com.nova.backend.payment.entity.PaymentStatus;
//import com.nova.backend.payment.repository.PaymentRepository;
//import com.nova.backend.payment.service.pg.PaymentGateway;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//
////📌 PG API 실패 시 RuntimeException 던지기
////→ 전체 트랜잭션 롤백
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class PaymentService {
//
//    private final OrderRepository orderRepository;
//    private final PaymentRepository paymentRepository;
//    private final KakaoPayClient kakaoPayClient;
//    private final List<PaymentGateway> gateways;
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
//                .method(PaymentMethod.KAKAOPAY)
//                .amount(order.getTotalPrice())
//                .status(PaymentStatus.READY)
//                .build();
//
//        // ✅ 연관관계 편의 메서드 사용
//        order.addPayment(payment);
//
//        paymentRepository.save(payment);
//
//
//        KakaoPayReadyRequest request = KakaoPayReadyRequest.builder()
//                .partner_order_id(order.getOrderId().toString())
//                .partner_user_id(order.getUser().getUserId().toString())
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
//    /**
//     * 결제 준비 (Checkout 단계)
//     */
//    //  체크아웃 진입점
//    public String ready(Long orderId, PaymentMethod method) {
//
//        return switch (method) {
//            case KAKAOPAY -> kakaoReady(orderId);
//            case TOSSPAY -> tossReady(orderId); // 나중에 구현
//        };
//    }
//
//    public void approve(String token, Long orderId, PaymentMethod method) {
//
//        OrderEntity order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new IllegalArgumentException("주문 없음"));
//
//        // ✅ 중복 승인 방지
//        if (order.isPaid()) {
//            throw new IllegalStateException("이미 결제된 주문");
//        }
//
//        PaymentGateway gateway = gateways.stream()
//                .filter(g -> g.getMethod() == method)
//                .findFirst()
//                .orElseThrow();
//
//        // PG 승인
//        gateway.approve(token, order);
//
//        // Payment 생성
//        PaymentEntity payment = PaymentEntity.builder()
//                .order(order)
//                .method(method)
//                .amount(order.getTotalPrice())
//                .status(PaymentStatus.APPROVED)
//                .build();
//
//        paymentRepository.save(payment);
//
//        // Order 상태 변경
//        order.markPaid(method);
//    }
//
//    public void fail(Long orderId, String reason) {
//        OrderEntity order = orderRepository.findById(orderId)
//                .orElseThrow();
//
//        order.markPaymentFailed(reason);
//    }
//
//    public void cancel(Long orderId) {
//        OrderEntity order = orderRepository.findById(orderId)
//                .orElseThrow();
//
//        order.markCanceled();
//    }
//
//
//
//    private String tossReady(Long orderId) {
//        return "";
//    }
//
//}
