package com.nova.backend.payment.controller;

import com.nova.backend.payment.service.KakaoPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/pay/kakao")
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;

    /**
     * ✅ 결제 성공
     * 카카오 → 서버 → 프론트
     */
    @GetMapping("/success")
    public String success(
            @RequestParam("pg_token") String pgToken,
            @RequestParam("orderId") Long orderId
    ) {
        // 카카오 결제 승인 처리
        kakaoPayService.approve(pgToken, orderId);

        // 프론트 결제 완료 페이지로 이동
        return "redirect:http://localhost:3000/payment/success?orderId=" + orderId;
    }

    /**
     * ❌ 결제 실패
     */
    @GetMapping("/fail")
    public String fail(@RequestParam Long orderId) {
        kakaoPayService.fail(orderId, "KAKAOPAY_FAIL");
        return "redirect:http://localhost:3000/payment/fail?orderId=" + orderId;
    }

    /**
     * ❌ 결제 취소
     */
    @GetMapping("/cancel")
    public String cancel(@RequestParam Long orderId) {
        kakaoPayService.cancel(orderId);
        return "redirect:http://localhost:3000/payment/cancel?orderId=" + orderId;
    }
}


//package com.nova.backend.payment.controller;
//
//import com.nova.backend.payment.service.KakaoPayService;
//import com.nova.backend.payment.service.KakaoPayService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
////@RestController
//@Controller
//@RequiredArgsConstructor
//@RequestMapping("/pay/kakao")
//public class KakaoPayController {
//
//    private final KakaoPayService paymentService;
//
//    // ✅ 결제 준비
//    @PostMapping("/ready")
//    public Map<String, Object> ready(@RequestParam Long orderId) {
//        return paymentService.ready(orderId);
//    }
//
//    // ✅ 결제 성공
//    @GetMapping("/success")
//    public String success(
//            @RequestParam("pg_token") String pgToken,
//            @RequestParam("orderId") Long orderId
//    ) {
//        paymentService.kakaoApprove(pgToken, orderId);
//
//        // 프론트 결제 완료 페이지로 이동
//        return "redirect:/payment/success?orderId=" + orderId;
//    }
//
//    // ❌ 결제 실패
//    @GetMapping("/fail")
//    public String fail(@RequestParam("orderId") Long orderId) {
//        paymentService.fail(orderId, "KAKAOPAY_FAIL");
//        return "redirect:/payment/fail?orderId=" + orderId;
//    }
//
//    // ❌ 결제 취소
//    @GetMapping("/cancel")
//    public String cancel(@RequestParam("orderId") Long orderId) {
//        paymentService.cancel(orderId);
//        return "redirect:/payment/cancel?orderId=" + orderId;
//    }
//}
