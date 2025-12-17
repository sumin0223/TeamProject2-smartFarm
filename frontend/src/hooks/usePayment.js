// src/hooks/usePayment.js

// CartContext의 items, totalPrice, userId를 사용해서

// 카카오 결제 준비 요청(/api/pay/kakao/ready) → 리다이렉트

// 토스 결제창 열기 (토스 JS SDK 사용)

import { useCallback } from "react";
import { useCart } from "../contexts/CartContext";

/**
 * 환경변수:
 * REACT_APP_TOSS_CLIENT_KEY
 * REACT_APP_BASE_URL (예: http://localhost:3000)
 */
export function usePayment() {
  const { items, totalPrice, userId } = useCart();

  const payWithKakao = useCallback(async () => {
    const res = await fetch(
      "/api/pay/kakao/ready",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          totalPrice,
          itemName:
            items.length === 1
              ? items[0].name
              : `장바구니외 ${
                  items.length - 1
                }건`,
          orderId: "ORDER_" + Date.now(),
        }),
      }
    );

    const data = await res.json();
    // ready 응답의 next_redirect_pc_url 로 이동 (PC)
    if (data?.next_redirect_pc_url) {
      window.location.href =
        data.next_redirect_pc_url;
    } else if (data?.next_redirect_mobile_url) {
      window.location.href =
        data.next_redirect_mobile_url;
    } else {
      alert("카카오페이 준비 실패");
    }
  }, [items, totalPrice, userId]);

  const payWithToss = useCallback(async () => {
    if (!window.TossPayments) {
      alert(
        "TossPayments SDK가 로드되지 않았습니다."
      );
      return;
    }
    const toss = window.TossPayments(
      process.env.REACT_APP_TOSS_CLIENT_KEY
    );

    try {
      await toss.requestPayment("카드", {
        amount: totalPrice,
        orderId: "ORDER_" + Date.now(),
        orderName: "장바구니 결제",
        customerName: userId || "Guest",
        successUrl: `${process.env.REACT_APP_BASE_URL}/pay/toss/success`,
        failUrl: `${process.env.REACT_APP_BASE_URL}/pay/toss/fail`,
      });
    } catch (err) {
      console.error("Toss 요청 실패", err);
    }
  }, [totalPrice, userId]);

  return { payWithKakao, payWithToss };
}
