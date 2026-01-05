// src/pages/OrderPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const [message, setMessage] = useState("");
  const [orderUid, setOrderUid] = useState(null);
  const navigate = useNavigate();

  const handleOrder = async () => {
    try {
      const response = await axios.post("/api/v1/orders/order");
      const params = new URLSearchParams(response.request.responseURL);
      const message = params.get("message");
      const orderUid = params.get("orderUid");
      setMessage(message);
      setOrderUid(orderUid);
    } catch (error) {
      console.error(error);
      setMessage("주문 실패");
    }
  };

  const goToPayment = () => {
    if (orderUid) {
      navigate(`/payment/${orderUid}`);
    } else {
      alert("먼저 주문을 진행해주세요.");
    }
  };

  return (
    <div>
      <h1>주문 페이지</h1>
      <button onClick={handleOrder}>주문하기</button>
      <div style={{ marginTop: "20px" }}>
        <button onClick={goToPayment}>결제 페이지로 이동</button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default OrderPage;
