package com.nova.backend.payment.dto;

import lombok.Getter;


//tid → DB에 저장 필수 (approve 때 필요)
@Getter
public class KakaoPayReadyResponse {
    private String tid;
    private String next_redirect_pc_url;
}

