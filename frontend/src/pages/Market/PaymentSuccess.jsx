import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("orderId");

  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }

    // 👉 필요하면 여기서 axios로 Spring Boot 결제 검증 가능
    // axios.post("/api/payments/confirm", { orderId })

    // 👉 주문 완료 페이지로 이동
    navigate(`/orders/complete/${orderId}`, { replace: true });
  }, [orderId, navigate]);

  return (
    <div>
      <h1>결제 완료 🎉</h1>
      <p>주문번호: {orderId}</p>

      <button onClick={() => navigate(`/orders/${orderId}`)}>
        주문 상세 보기
      </button>
    </div>
  );
}
