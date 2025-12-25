//package com.nova.backend.payment.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
////📌 PG API 실패 시 RuntimeException 던지기
////→ 전체 트랜잭션 롤백
//
////PG 서비스는 결제 검증만
////KakaoPayService / TossPayService
////→ PG API 호출
////→ 성공 / 실패만 판단
//@Service
//@RequiredArgsConstructor
//public class TossPayService {
//
//    //토스는 ready상태 없다함 아래거 ready 지우면 되나?
//    public String ready(Long orderId) {
//        // TODO: 토스 결제 생성 API
//        return "https://toss.pg/redirect-url";
//    }
//
//    public void approve(String paymentKey, Long orderId) {
//        // TODO: 토스 결제 승인 API 호출
//        // 토스 결제 성공시 orderService.updatePaymentSuccess(orderId, "TOSSPAY");
//        // 실패 시 Exception throw
//    }
//}
//
