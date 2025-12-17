package com.nova.backend.payment.service;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.repository.OrderRepository;
import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class KakaoPayService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;


    //private final RestTemplate restTemplate = new RestTemplate();
    private final RestTemplate restTemplate; // ✅ 생성자 주입

    @Value("${kakao.pay.admin-key}")
    private String adminKey;

    @Value("${kakao.pay.cid}")
    private String cid;

    /**
     * 🟢 카카오페이 Ready
     * - 결제 준비
     * - redirectUrl 반환
     */
    public String ready(Long orderId) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 없음"));

        if (order.isPaid()) {
            throw new IllegalStateException("이미 결제된 주문");
        }

        // Payment READY 저장 (tid는 아직 없음)
        PaymentEntity payment = PaymentEntity.builder()
                .order(order)
                .method(PaymentMethod.KAKAOPAY)
                .amount(order.getTotalPrice())
                .status(PaymentStatus.READY)
                .build();

        paymentRepository.save(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", order.getUser().getUserId().toString());
        params.add("item_name", order.getOrderName());
        params.add("quantity", String.valueOf(order.getTotalQuantity()));
        params.add("total_amount", String.valueOf(order.getTotalPrice()));
        params.add("tax_free_amount", "0");

        params.add("approval_url",
                "http://localhost:8080/pay/kakao/success?orderId=" + orderId);
        params.add("fail_url",
                "http://localhost:8080/pay/kakao/fail?orderId=" + orderId);
        params.add("cancel_url",
                "http://localhost:8080/pay/kakao/cancel?orderId=" + orderId);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/ready",
                request,
                Map.class
        );

        // 카카오 거래 ID(tid) 저장
        String tid = (String) response.getBody().get("tid");
        payment.approve(tid);

        // 프론트 redirect URL 반환
        return (String) response.getBody().get("next_redirect_pc_url");
    }

    /**
     * ✅ 결제 승인
     */
    public void approve(String pgToken, Long orderId) {

        PaymentEntity payment = paymentRepository
                .findByOrder_OrderIdAndMethod(orderId, PaymentMethod.KAKAOPAY)
                .orElseThrow();

        if (payment.getStatus() == PaymentStatus.APPROVED) {
            return; // 중복 승인 방지
        }

        OrderEntity order = payment.getOrder();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("tid", payment.getTid());
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", order.getUser().getUserId().toString());
        params.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/approve",
                request,
                Map.class
        );

        // 결제 완료 처리
        //payment.markApproved();
        order.markPaid(PaymentMethod.KAKAOPAY);
    }

    public void fail(Long orderId, String reason) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow();
        order.markPaymentFailed(reason);
    }

    public void cancel(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow();
        order.markCanceled();
    }
}


//package com.nova.backend.payment.service;
//
//import com.nova.backend.order.entity.OrderEntity;
//import com.nova.backend.order.repository.OrderRepository;
//import com.nova.backend.payment.dto.KakaoPayApproveResponse;
//import com.nova.backend.payment.dto.KakaoPayReadyRequest;
//import com.nova.backend.payment.dto.KakaoPayReadyResponse;
//import com.nova.backend.payment.entity.PaymentEntity;
//import com.nova.backend.payment.repository.PaymentRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestTemplate;
//
//@Service
//@RequiredArgsConstructor
//public class KakaoPayService {
//
//    private final OrderRepository orderRepository;
//    private final PaymentRepository paymentRepository;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @Value("${kakao.pay.admin-key}")
//    private String adminKey;
//
//    @Value("${kakao.pay.cid}")
//    private String cid;
//
//    @Value("${kakao.pay.ready-url}")
//    private String readyUrl;
//
//    @Value("${kakao.pay.approve-url}")
//    private String approveUrl;
//
//    /* =========================
//       공통 헤더
//       ========================= */
//    private HttpHeaders headers() {
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "KakaoAK " + adminKey);
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        return headers;
//    }
//
//    /* =========================
//       READY
//       ========================= */
//    public KakaoPayReadyResponse ready(KakaoPayReadyRequest request) {
//
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("cid", cid);
//        params.add("partner_order_id", request.getPartner_order_id());
//        params.add("partner_user_id", request.getPartner_user_id());
//        params.add("item_name", request.getItem_name());
//        params.add("quantity", String.valueOf(request.getQuantity()));
//        params.add("total_amount", String.valueOf(request.getTotal_amount()));
//        params.add("tax_free_amount", "0");
//        params.add("approval_url", request.getApproval_url());
//        params.add("fail_url", request.getFail_url());
//        params.add("cancel_url", request.getCancel_url());
//
//        HttpEntity<MultiValueMap<String, String>> entity =
//                new HttpEntity<>(params, headers());
//
//        KakaoPayReadyResponse response =
//                restTemplate.postForObject(
//                        readyUrl,
//                        entity,
//                        KakaoPayReadyResponse.class
//                );
//
//        if (response == null || response.getTid() == null) {
//            throw new IllegalStateException("카카오페이 READY 실패");
//        }
//
//        return response;
//    }
//
//    /* =========================
//       APPROVE
//       ========================= */
//    public KakaoPayApproveResponse approve(
//            String tid,
//            String pgToken,
//            OrderEntity order
//    ) {
//
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("cid", cid);
//        params.add("tid", tid);
//        params.add("partner_order_id", order.getOrderId().toString());
//        params.add("partner_user_id", order.getUser().getUserId().toString());
//        params.add("pg_token", pgToken);
//
//        HttpEntity<MultiValueMap<String, String>> entity =
//                new HttpEntity<>(params, headers());
//
//        KakaoPayApproveResponse response =
//                restTemplate.postForObject(
//                        approveUrl,
//                        entity,
//                        KakaoPayApproveResponse.class
//                );
//
//        if (response == null) {
//            throw new IllegalStateException("카카오페이 APPROVE 실패");
//        }
//
//        return response;
//    }
//}




//package com.nova.backend.payment.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class KakaoPayService {
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @Value("${kakao.pay.admin-key}")
//    private String adminKey;
//
//    @Value("${kakao.pay.cid}")
//    private String cid;
//
//    public Map<String, Object> kakaoReady(Long orderId) {
//
//        // TODO: 주문 조회 (금액, 상품명)
//        String itemName = "NOVA 상품";
//        int totalAmount = 10000;
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "KakaoAK " + adminKey);
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("cid", cid);
//        params.add("partner_order_id", orderId.toString());
//        params.add("partner_user_id", "NOVA_USER");
//        params.add("item_name", itemName);
//        params.add("quantity", "1");
//        params.add("total_amount", String.valueOf(totalAmount));
//        params.add("tax_free_amount", "0");
//
//        params.add("approval_url",
//                "http://localhost:8080/pay/kakao/success?orderId=" + orderId);
//        params.add("cancel_url",
//                "http://localhost:8080/pay/kakao/cancel?orderId=" + orderId);
//        params.add("fail_url",
//                "http://localhost:8080/pay/kakao/fail?orderId=" + orderId);
//
//        HttpEntity<MultiValueMap<String, String>> request =
//                new HttpEntity<>(params, headers);
//
//        ResponseEntity<Map> response = restTemplate.postForEntity(
//                "https://kapi.kakao.com/v1/payment/ready",
//                request,
//                Map.class
//        );
//
//        return response.getBody(); // next_redirect_pc_url 포함
//    }
//}


//package com.nova.backend.payment.service;
//
//import com.nova.backend.payment.dto.KakaoPayApproveResponse;
//import com.nova.backend.payment.dto.KakaoPayReadyRequest;
//import com.nova.backend.payment.dto.KakaoPayReadyResponse;
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
//public class KakaoPayService {
//
//    public KakaoPayReadyResponse ready(Long orderId) {
//        // TODO: 카카오페이 Ready API 호출
//        // orderId → partner_order_id
//
//        return "https://kakaopay.pg/redirect-url";
//    }
//
//    public KakaoPayApproveResponse approve(String pgToken, Long orderId) {
//        // TODO: 카카오페이 Approve API 호출
//        // 1. DB에서 tid 조회
//        // 2. 카카오 approve API 호출
//        // 3. 실패 시 Exception throw
//        // 4. 성공 시 orderService.updatePaymentSuccess(orderId, "KAKAOPAY");
//
//
//        return null;
//    }
//}
