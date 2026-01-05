package com.nova.backend.payment.controller;

import com.nova.backend.payment.dto.PaymentCallbackRequestDTO;
import com.nova.backend.payment.service.PaymentService;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    // 우리 백엔드 서버로 결제 승인 요청 들어오면
    // 결제 승인 콜백 처리 = 이게 결제 api 다
    @PostMapping
    public ResponseEntity<IamportResponse<Payment>> validatePayment(
            @RequestBody PaymentCallbackRequestDTO request) {
        IamportResponse<Payment> iamportResponse = paymentService.paymentByCallback(request);
        log.info("결제 응답={}", iamportResponse.getResponse().toString());
        return new ResponseEntity<>(iamportResponse, HttpStatus.OK);
    }

//    @GetMapping("/success-payment")
//    public String successPaymentPage() {
//        return "success-payment";
//    }
//
//    @GetMapping("/fail-payment")
//    public String failPaymentPage() {
//        return "fail-payment";
//    }

    //    // orderUid로 React에서 결제테이블 데이터를 JSON으로 받아오기
//    @GetMapping("/{orderUid}")
//    public ResponseEntity<RequestPayDTO> getPaymentData(@PathVariable String orderUid) {
//        RequestPayDTO requestDto = paymentService.findRequestDto(orderUid);
//        if (requestDto != null) {
//            return ResponseEntity.ok(requestDto);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }



//    @GetMapping("/{orderUid}")
//    public String paymentPage(@PathVariable(name = "orderUid", required = false) String orderUid,
//                              Model model) {
//
//        RequestPayDTO requestDto = paymentService.findRequestDto(orderUid);
//        model.addAttribute("requestDto", requestDto);
//
//        return "payment";
//    }
//
//    @ResponseBody
//    @PostMapping
//    public ResponseEntity<IamportResponse<Payment>> validationPayment(@RequestBody PaymentCallbackRequest request) {
//        IamportResponse<Payment> iamportResponse = paymentService.paymentByCallback(request);
//
//        log.info("결제 응답={}", iamportResponse.getResponse().toString());
//        // "http://localhost/payment?imp_uid=imp_359888216361&merchant_uid=255eae01-2b82-4cbf-b40b-49b12d793703&imp_success=true"
//        return new ResponseEntity<>(iamportResponse, HttpStatus.OK);
//
//    }
//

}
