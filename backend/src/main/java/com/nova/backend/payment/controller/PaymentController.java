//package com.nova.backend.payment.controller;
//
//import com.nova.backend.payment.entity.PaymentMethod;
//import com.nova.backend.payment.service.KakaoPayService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.net.URI;
//
//@RestController
//@RequestMapping("/pay")
//@RequiredArgsConstructor
//public class PaymentController {
//
//    private static final String FRONT_SUCCESS = "https://frontend/pay/success?orderId=";
//    private static final String FRONT_FAIL = "https://frontend/pay/fail?orderId=";
//
//    private final KakaoPayService paymentService;
//
//    @PostMapping("/kakao/ready")
//    public ResponseEntity<String> kakaoReady(@RequestParam Long orderId) {
//        String redirectUrl = paymentService.kakaoReady(orderId);
//        return ResponseEntity.ok(redirectUrl);
//    }
//
//    @GetMapping("/kakao/success")
//    public ResponseEntity<Void> kakaoSuccess(
//            @RequestParam("pg_token") String pgToken,
//            @RequestParam Long orderId
//    ) {
//        paymentService.kakaoApprove(pgToken, orderId);
//        return redirect("https://frontend/pay/success?orderId=" + orderId);
//    }
//
//    @GetMapping("/kakao/fail")
//    public ResponseEntity<Void> kakaoFail(@RequestParam Long orderId) {
//        paymentService.fail(orderId, "KAKAO_FAIL");
//        return redirect("https://frontend/pay/fail?orderId=" + orderId);
//    }
//
//    @GetMapping("/kakao/cancel")
//    public ResponseEntity<Void> kakaoCancel(@RequestParam Long orderId) {
//        paymentService.cancel(orderId);
//        return redirect("https://frontend/pay/fail?orderId=" + orderId);
//    }
//
//    private ResponseEntity<Void> redirect(String url) {
//        return ResponseEntity.status(HttpStatus.FOUND)
//                .location(URI.create(url))
//                .build();
//    }
//
//
//
//
//
//
//
//    /**
//     *  토스 결제 성공
//     */
//    @GetMapping("/toss/success")
//    public void tossSuccess(
//            @RequestParam("paymentKey") String paymentKey,
//            @RequestParam Long orderId
//    ) {
//        paymentService.approve(paymentKey, orderId, PaymentMethod.TOSSPAY);
//    }
//
//    /**
//     *  토스 결제 실패
//     */
//    @GetMapping("/toss/fail")
//    public void tossFail(
//            @RequestParam Long orderId
//    ) {
//        paymentService.fail(orderId, "TOSS_FAIL");
//    }
//
//
//
//
//
//    @GetMapping("/{pg}/success")
//    public ResponseEntity<Void> success(
//            @PathVariable String pg,
//            @RequestParam String token,
//            @RequestParam Long orderId
//    ) {
//        PaymentMethod method = PaymentMethod.from(pg);
//        paymentService.approve(token, orderId, method);
//
//        return redirect(FRONT_SUCCESS + orderId);
//    }
//
//    @GetMapping("/{pg}/fail")
//    public ResponseEntity<Void> fail(
//            @PathVariable String pg,
//            @RequestParam Long orderId
//    ) {
//        paymentService.fail(orderId, pg.toUpperCase() + "_FAIL");
//        return redirect(FRONT_FAIL + orderId);
//    }
//
//    @GetMapping("/{pg}/cancel")
//    public ResponseEntity<Void> cancel(
//            @PathVariable String pg,
//            @RequestParam Long orderId
//    ) {
//        paymentService.cancel(orderId);
//        return redirect(FRONT_FAIL + orderId);
//    }
//
//    private ResponseEntity<Void> redirect(String url) {
//        return ResponseEntity.status(HttpStatus.FOUND)
//                .location(URI.create(url))
//                .build();
//    }
//}
//
//
//
//
//
