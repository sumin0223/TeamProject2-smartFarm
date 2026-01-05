// src/pages/OrderPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getOrderDetail } from "../../api/order/orderApi";
import backendServer from "../../api/backendServer";

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const [requestDto, setRequestDto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [IMPReady, setIMPReady] = useState(false);

  // 배송/결제 입력 정보
  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerTel: "",
    buyerAddress: "",
    buyerPostcode: "",
    paymentMethod: "card", // 카드 기본
  });

  const [cartTotal, setCartTotal] = useState(0); // 실시간 총액 계산
  const navigate = useNavigate();

  // 아임포트 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.onload = () => setIMPReady(true);
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const data = await createOrder(form); // 입력 필드 데이터 전달
      if (!data || !data.orderUid) {
        alert("주문 생성 실패");
        return;
      }
      setOrder(data);
      setCartTotal(data.totalPrice);

      const paymentInfo = await getOrderDetail(data.orderUid);
      setRequestDto(paymentInfo);
    } catch (error) {
      console.error(error);
      alert("주문 또는 결제 정보 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  const requestPay = () => {
    if (!requestDto || !IMPReady) {
      alert("결제 준비가 아직 완료되지 않았습니다.");
      return;
    }

    const IMP = window.IMP;
    IMP.init("imp62232411");

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: form.paymentMethod,
        merchant_uid: requestDto.orderUid,
        goods_name: requestDto.itemName,
        amount: cartTotal,
        buyer_email: form.buyerEmail,
        buyer_name: form.buyerName,
        buyer_tel: form.buyerTel,
        buyer_addr: form.buyerAddress,
        buyer_postcode: form.buyerPostcode,
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

  // 스타일
  const containerStyle = {
    maxWidth: 800,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  };
  const sectionStyle = {
    marginBottom: 30,
    padding: 20,
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };
  const inputStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  };
  const flexRow = {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
  };
  const halfWidth = { flex: "1 1 48%" };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: 40 }}>체크아웃</h1>

      {!order && (
        <div style={sectionStyle}>
          <h2>배송 정보</h2>
          <div style={flexRow}>
            <input
              type="text"
              name="buyerName"
              placeholder="이름"
              value={form.buyerName}
              onChange={handleInputChange}
              style={halfWidth}
            />
            <input
              type="email"
              name="buyerEmail"
              placeholder="이메일"
              value={form.buyerEmail}
              onChange={handleInputChange}
              style={halfWidth}
            />
            <input
              type="text"
              name="buyerTel"
              placeholder="전화번호"
              value={form.buyerTel}
              onChange={handleInputChange}
              style={halfWidth}
            />
            <input
              type="text"
              name="buyerAddress"
              placeholder="주소"
              value={form.buyerAddress}
              onChange={handleInputChange}
              style={halfWidth}
            />
            <input
              type="text"
              name="buyerPostcode"
              placeholder="우편번호"
              value={form.buyerPostcode}
              onChange={handleInputChange}
              style={halfWidth}
            />
          </div>

          <h2>결제 정보</h2>
          <div style={flexRow}>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleInputChange}
              style={halfWidth}
            >
              <option value="card">신용/체크카드</option>
              <option value="vbank">가상계좌</option>
              <option value="trans">계좌이체</option>
            </select>
            <input
              type="number"
              placeholder="결제 금액"
              value={cartTotal}
              onChange={(e) => setCartTotal(Number(e.target.value))}
              style={halfWidth}
            />
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            style={{
              width: "100%",
              padding: 15,
              fontSize: 18,
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            {loading ? "주문 처리중..." : "주문 생성 및 결제 준비"}
          </button>
        </div>
      )}

      {order && (
        <div style={sectionStyle}>
          <h2>주문 상세</h2>
          <p><strong>주문번호:</strong> {order.orderUid}</p>
          <p><strong>총 가격:</strong> {order.totalPrice}원</p>
          <p><strong>주문 상태:</strong> {order.status}</p>
          <p><strong>결제 상태:</strong> {order.paymentStatus}</p>
          <p><strong>결제 수단:</strong> {order.paymentMethod}</p>
          <p><strong>배송 주소:</strong> {order.deliveryAddress}</p>
          <p><strong>연락처:</strong> {order.phoneNumber}</p>

          <h3>주문 상품</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName} x {item.quantity} = {item.price}원
              </li>
            ))}
          </ul>

          {requestDto && (
            <div style={{ marginTop: 20 }}>
              <h3>결제 정보</h3>
              <p>상품명: {requestDto.itemName}</p>
              <p>결제 금액: {cartTotal}원</p>
              <button
                onClick={requestPay}
                disabled={!IMPReady}
                style={{
                  width: "100%",
                  padding: 15,
                  fontSize: 18,
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginTop: 10,
                }}
              >
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
