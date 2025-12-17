import { useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "../../api/axios";

export default function PaySuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const pgToken = params.get("pg_token"); // 카카오
    const paymentKey = params.get("paymentKey"); // 토스
    const orderId = params.get("orderId");
    const method = params.get("method"); // KAKAOPAY / TOSSPAY

    axios
      .post("/payment/success", {
        pgToken,
        paymentKey,
        orderId,
        method,
      })
      .then(() => {
        navigate(`/order/complete/${orderId}`, {
          replace: true,
        });
      })
      .catch(() => {
        navigate(`/order/fail/${orderId}`, {
          replace: true,
        });
      });
  }, []);

  return (
    <div className="pay-result loading">
      <h2>결제 승인 처리 중입니다...</h2>
      <p>잠시만 기다려 주세요</p>
    </div>
  );
}
