package com.nova.backend.payment.client;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.payment.dto.KakaoPayApproveResponse;
import com.nova.backend.payment.dto.KakaoPayReadyRequest;
import com.nova.backend.payment.dto.KakaoPayReadyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class KakaoPayClient {

    @Value("${kakao.pay.admin-key}")
    private String adminKey;

    @Value("${kakao.pay.cid}")
    private String cid;

    @Value("${kakao.pay.ready-url}")
    private String readyUrl;

    @Value("${kakao.pay.approve-url}")
    private String approveUrl;

    private final RestTemplate restTemplate;

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }

    public KakaoPayReadyResponse ready(KakaoPayReadyRequest request) {

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("partner_order_id", request.getPartner_order_id());
        params.add("partner_user_id", request.getPartner_user_id());
        params.add("item_name", request.getItem_name());
        params.add("quantity", String.valueOf(request.getQuantity()));
        params.add("total_amount", String.valueOf(request.getTotal_amount()));
        params.add("tax_free_amount", "0");
        params.add("approval_url", request.getApproval_url());
        params.add("fail_url", request.getFail_url());
        params.add("cancel_url", request.getCancel_url());

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(params, headers());

        try {
            return restTemplate.postForObject(
                    readyUrl,
                    entity,
                    KakaoPayReadyResponse.class
            );
        } catch (Exception e) {
            throw new IllegalStateException("카카오페이 READY 실패", e);
        }
    }

    public KakaoPayApproveResponse approve(String tid, String pgToken, OrderEntity order) {

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("tid", tid);
        params.add("partner_order_id", order.getOrderId().toString());
        params.add("partner_user_id", order.getUser().getUserId().toString());
        params.add("pg_token", pgToken);
        params.add("total_amount", String.valueOf(order.getTotalPrice()));

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(params, headers());

        try {
            return restTemplate.postForObject(
                    approveUrl,
                    entity,
                    KakaoPayApproveResponse.class
            );
        } catch (Exception e) {
            throw new IllegalStateException("카카오페이 APPROVE 실패", e);
        }
    }
}


