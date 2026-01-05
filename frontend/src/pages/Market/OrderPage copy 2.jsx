// src/pages/OrderPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getOrderDetail } from "../../api/order/orderApi";
import backendServer from "../../api/backendServer"; // axios instance 등

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const [requestDto, setRequestDto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [IMPReady, setIMPReady] = useState(false);
  const navigate = useNavigate();

  // 1️⃣ 아임포트 SDK 동적 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.onload = () => setIMPReady(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 2️⃣ 주문 생성 및 결제 정보 가져오기
  const handleOrder = async () => {
    setLoading(true);
    try {
      const data = await createOrder();
      if (!data || !data.orderUid) {
        alert("주문 생성 실패");
        return;
      }
      setOrder(data);

      const paymentInfo = await getOrderDetail(data.orderUid);
      setRequestDto(paymentInfo);
    } catch (error) {
      console.error(error);
      alert("주문 또는 결제 정보 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ 결제 요청
  const requestPay = () => {
    if (!requestDto || !IMPReady) {
      alert("결제 준비가 아직 완료되지 않았습니다.");
      return;
    }

    const IMP = window.IMP;
    IMP.init("imp62232411"); // 가맹점 식별코드

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: requestDto.orderUid,
        goods_name: requestDto.itemName,
        amount: requestDto.paymentPrice,
        buyer_email: requestDto.buyerEmail,
        buyer_name: requestDto.buyerName,
        buyer_tel: requestDto.buyerTel || "010-1234-5678",
        buyer_addr: requestDto.buyerAddress,
        buyer_postcode: requestDto.buyerPostcode || "123-456",
      },
      async function (rsp) {
        if (rsp.success) {
          try {
            await backendServer.post("/payment", {
              payment_uid: rsp.imp_uid,
              order_uid: rsp.merchant_uid,
            });
            alert("결제 완료!");
            navigate("/success-payment");
          } catch (error) {
            console.error(error);
            alert("서버 결제 승인 중 오류 발생");
            navigate("/fail-payment");
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
          navigate("/fail-payment");
        }
      }
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>주문 및 결제 </h1>
      {!order && (
        <button onClick={handleOrder} disabled={loading}>
          {loading ? "주문 처리중..." : "주문하기"}
        </button>
      )}

      {order && (
        <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
          <h2>주문 상세</h2>
          <p><strong>주문번호:</strong> {order.orderUid}</p>
          <p><strong>총 가격:</strong> {order.totalPrice}</p>
          <p><strong>주문 상태:</strong> {order.status}</p>
          <p><strong>결제 상태:</strong> {order.paymentStatus}</p>
          <p><strong>결제 수단:</strong> {order.paymentMethod}</p>
          <p><strong>배송 주소:</strong> {order.deliveryAddress}</p>
          <p><strong>연락처:</strong> {order.phoneNumber}</p>

          <h3>주문 상품</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName} x {item.quantity} = {item.price}
              </li>
            ))}
          </ul>

          {requestDto && (
            <div style={{ marginTop: 20 }}>
              <h3>결제 정보</h3>
              <p>상품명: {requestDto.itemName}</p>
              <p>결제 금액: {requestDto.paymentPrice}원</p>
              <button onClick={requestPay} disabled={!IMPReady}>
                결제하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
