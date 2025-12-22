import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PayTossSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = sessionStorage.getItem("lastOrderId");
    if (!orderId) {
      alert("유효하지 않은 결제 요청입니다.");
      navigate("/");
      return;
    }
    navigate(`/tracking/${orderId}`);
  }, [navigate]);

  return <div>결제 성공! 주문 정보를 불러오는 중...</div>;
}
