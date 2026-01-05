// src/pages/OrderPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getOrderDetail } from "../../api/order/orderApi";
import backendServer from "../../api/backendServer"; 
import { Button } from "../../components/market/ui/button";
import { Input } from "../../components/market/ui/input";
import { Label } from "../../components/market/ui/label";
import { toast } from "sonner";

import "./Checkout.css"; // Checkout.css 그대로 사용

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const [requestDto, setRequestDto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [IMPReady, setIMPReady] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerTel: "",
    buyerAddress: "",
    buyerPostcode: "",
    buyerMessage: "",
  });

  const [items, setItems] = useState([]); // 주문 상품 목록
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.onload = () => setIMPReady(true);
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  // 주문 생성
  const handleOrder = async () => {
    if (!formData.buyerName || !formData.buyerTel || !formData.buyerAddress) {
      toast.error("필수 정보를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await createOrder(); // 기존 OrderPage 로직 그대로
      if (!data || !data.orderUid) {
        toast.error("주문 생성 실패");
        return;
      }
      setOrder(data);

      const paymentInfo = await getOrderDetail(data.orderUid);
      setRequestDto(paymentInfo);
      setTotalPrice(paymentInfo.paymentPrice);
    } catch (err) {
      console.error(err);
      toast.error("주문 생성 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 결제 요청
  const requestPay = () => {
    if (!requestDto || !IMPReady) {
      toast.error("결제 준비가 아직 완료되지 않았습니다.");
      return;
    }

    const IMP = window.IMP;
    IMP.init("imp62232411");

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: requestDto.orderUid,
        goods_name: requestDto.itemName,
        amount: totalPrice,
        buyer_email: formData.buyerEmail,
        buyer_name: formData.buyerName,
        buyer_tel: formData.buyerTel,
        buyer_addr: formData.buyerAddress,
        buyer_postcode: formData.buyerPostcode,
      },
      async function (rsp) {
        if (rsp.success) {
          try {
            await backendServer.post("/payment", {
              payment_uid: rsp.imp_uid,
              order_uid: rsp.merchant_uid,
            });
            toast.success("결제 완료!");
            navigate("/success-payment");
          } catch (error) {
            console.error(error);
            toast.error("서버 결제 승인 중 오류 발생");
            navigate("/fail-payment");
          }
        } else {
          toast.error("결제 실패: " + rsp.error_msg);
          navigate("/fail-payment");
        }
      }
    );
  };

  // 주소 검색 (daum)
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({ ...prev, buyerAddress: data.address }));
      },
    }).open();
  };

  return (
    <div className="cart-page-container">
      <header className="cart-header">
        <div className="cart-header-inner">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            뒤로가기
          </button>
          <h1 className="cart-title">주문/결제</h1>
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout">
          {/* 주문 상품 리스트 */}
          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty-box">
                <p className="cart-empty-text">주문할 상품이 없습니다.</p>
              </div>
            ) : (
              items.map((item) => (
                <div className="cart-card" key={item.productId}>
                  <img src={item.image} alt={item.productName} className="cart-card-img" />
                  <div className="cart-card-info">
                    <h3 className="cart-card-title">{item.productName}</h3>
                    <p className="cart-card-unit">{item.price.toLocaleString()}원</p>
                    <p className="cart-card-price">{(item.price * item.quantity).toLocaleString()}원</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 배송/결제 정보 */}
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="checkout-card">
              <h2 className="checkout-card-title">배송 정보</h2>
              <InputField label="받는 분" value={formData.buyerName} onChange={(v) => setFormData({ ...formData, buyerName: v })} />
              <InputField label="연락처" value={formData.buyerTel} onChange={(v) => setFormData({ ...formData, buyerTel: v })} />
              <div className="checkout-field">
                <Label className="checkout-label">주소</Label>
                <div className="flex gap-2">
                  <Input className="checkout-input" value={formData.buyerAddress} readOnly />
                  <Button type="button" onClick={handleAddressSearch}>주소찾기</Button>
                </div>
              </div>
              <InputField label="상세 주소" value={formData.buyerPostcode} onChange={(v) => setFormData({ ...formData, buyerPostcode: v })} />
              <InputField label="배송 메시지" value={formData.buyerMessage} onChange={(v) => setFormData({ ...formData, buyerMessage: v })} />
            </div>

            {/* 주문 생성 버튼 */}
            {!requestDto && (
              <div className="checkout-card">
                <Button className="checkout-pay-btn" onClick={handleOrder} disabled={loading}>
                  {loading ? "주문 처리중..." : "주문 생성"}
                </Button>
              </div>
            )}

            {/* 결제 버튼 */}
            {requestDto && (
              <div className="checkout-card">
                <div className="summary-price-box">
                  <div className="summary-line">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="summary-line">
                    <span>배송비</span>
                    <span className="free">무료</span>
                  </div>
                  <div className="summary-total">
                    <span>최종 결제금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                </div>
                <Button className="checkout-pay-btn" onClick={requestPay} disabled={!IMPReady || loading}>
                  {loading ? "결제 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

function InputField({ label, value, onChange }) {
  return (
    <div className="checkout-field">
      <Label className="checkout-label">{label}</Label>
      <Input className="checkout-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default OrderPage;
