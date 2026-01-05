// src/pages/Checkout/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";

import { useAuth } from "../../api/auth/AuthContext";
import { useOrders } from "../../api/market/OrderContext";
import { useCart } from "../../api/market/CartContext";

import { Button } from "../../components/market/ui/button";
import { Input } from "../../components/market/ui/input";
import { Label } from "../../components/market/ui/label";

import "./Checkout.css";

export default function Checkout() {
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const {
    cartItems,
    removeItem,
    changeQuantity,
    clearAll,
  } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // directBuyItem 처리
  const directBuyItems = location.state?.directBuyItems;
  const [items, setItems] = useState(directBuyItems || cartItems || []);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    detailAddress: user?.detailAddress || "",
    message: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("kakaopay");

  /* =========================
     주소 검색
  ========================= */
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({ ...prev, address: data.address }));
      },
    }).open();
  };

  /* =========================
     로그인 체크
  ========================= */
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/checkout", directBuyItems },
      });
    }
  }, [user, navigate]);

  /* =========================
     수량 증가/감소
  ========================= */
  const handleIncrease = (item) => {
    changeQuantity(item.cartItemId, item.quantity + 1);
    setItems((prev) =>
      prev.map((it) =>
        it.cartItemId === item.cartItemId
          ? { ...it, quantity: it.quantity + 1 }
          : it
      )
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      toast.error("최소 수량은 1개입니다.");
      return;
    }
    changeQuantity(item.cartItemId, item.quantity - 1);
    setItems((prev) =>
      prev.map((it) =>
        it.cartItemId === item.cartItemId
          ? { ...it, quantity: it.quantity - 1 }
          : it
      )
    );
  };

  /* =========================
     개별 삭제
  ========================= */
  const handleRemove = (item) => {
    removeItem(item.productId);
    setItems((prev) => prev.filter((it) => it.productId !== item.productId));
    toast.success("상품이 삭제되었습니다.");
  };

  /* =========================
     전체 삭제
  ========================= */
  const handleClearAll = () => {
    if (items.length === 0) return;
    clearAll();
    setItems([]);
    toast.success("장바구니를 비웠습니다.");
  };

  /* =========================
     주문 제출
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("필수 정보를 모두 입력해주세요");
      return;
    }

    setLoading(true);

    try {
      const fullAddress = `${formData.address} ${formData.detailAddress}`.trim();
      const order = await createOrder(
        items,
        totalPrice,
        fullAddress,
        formData.phone,
        paymentMethod
      );

      sessionStorage.setItem("lastOrderId", order.id);
      toast.success("주문이 완료되었습니다!", {
        description: `주문번호: ${order.id}`,
      });
      navigate(`/tracking/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     렌더링
  ========================= */
  return (
    <div className="cart-page-container">
      {/* HEADER */}
      <header className="cart-header">
        <div className="cart-header-inner">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            뒤로가기
          </button>

          <h1 className="cart-title">주문/결제</h1>

          {items.length > 0 && (
            <button className="clear-btn" onClick={handleClearAll}>
              <Trash2 size={16} />
              전체 삭제
            </button>
          )}
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout">
          {/* ================= ITEMS ================= */}
          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty-box">
                <p className="cart-empty-text">장바구니가 비어 있습니다.</p>

                <button
                  className="cart-continue-btn"
                  onClick={() => navigate("/market")}
                >
                  쇼핑하러 가기
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div className="cart-card" key={item.productId}>
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="cart-card-img"
                  />

                  <div className="cart-card-info">
                    <h3 className="cart-card-title">{item.productName}</h3>

                    <p className="cart-card-unit">{item.price.toLocaleString()}원</p>

                    <div className="cart-qty-row">
                      <div className="cart-qty-box">
                        <button onClick={() => handleDecrease(item)}>
                          <Minus size={16} />
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => handleIncrease(item)}>
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="cart-card-price">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemove(item)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ================= 배송/결제 ================= */}
          {items.length > 0 && (
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-card">
                <h2 className="checkout-card-title">배송 정보</h2>

                <InputField
                  label="받는 분"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
                <InputField
                  label="연락처"
                  value={formData.phone}
                  onChange={(v) => setFormData({ ...formData, phone: v })}
                />
                <div className="checkout-field">
                  <Label className="checkout-label">주소</Label>
                  <div className="flex gap-2">
                    <Input className="checkout-input" value={formData.address} readOnly />
                    <Button type="button" onClick={handleAddressSearch}>
                      주소찾기
                    </Button>
                  </div>
                </div>
                <InputField
                  label="상세 주소"
                  value={formData.detailAddress}
                  onChange={(v) => setFormData({ ...formData, detailAddress: v })}
                />
                <InputField
                  label="배송 메시지"
                  value={formData.message}
                  onChange={(v) => setFormData({ ...formData, message: v })}
                />
              </div>

              {/* 결제 수단
              <div className="checkout-card">
                <h2 className="checkout-card-title">결제 수단</h2>
                <div className="payment-list">
                  {["kakaopay", "tosspay"].map((method) => (
                    <div
                      key={method}
                      className={`payment-item ${paymentMethod === method ? "active" : ""}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <Label className="payment-label">
                        {method === "kakaopay" ? "💬 카카오페이" : "💳 토스페이"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* 최종 결제 버튼 */}
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
                <Button className="checkout-pay-btn" disabled={loading}>
                  {loading ? "결제 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="checkout-field">
      <Label className="checkout-label">{label}</Label>
      <Input className="checkout-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
