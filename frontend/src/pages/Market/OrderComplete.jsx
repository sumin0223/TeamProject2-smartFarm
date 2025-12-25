import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderComplete() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(() => navigate("/"));
  }, []);

  if (!order) return <div>주문 정보를 불러오는 중...</div>;

  return (
    <div className="order-complete">
      <h1>주문이 완료되었습니다 🎉</h1>

      <section>
        <p>주문번호: {order.orderId}</p>
        <p>결제금액: {order.totalPrice.toLocaleString()}원</p>
        <p>결제수단: {order.paymentMethod}</p>
      </section>

      <section>
        <h3>배송지</h3>
        <p>{order.deliveryAddress}</p>
        <p>{order.phoneNumber}</p>
      </section>

      <section>
        <h3>주문 상품</h3>
        {order.items.map(item => (
          <div key={item.orderItemId}>
            {item.name} × {item.quantity}
          </div>
        ))}
      </section>

      <button onClick={() => navigate(`/orders/${orderId}`)}>
        주문 상세 보기
      </button>

      <button onClick={() => navigate("/")}>
        홈으로
      </button>
    </div>
  );
}
