import { useState, useEffect } from "react";
import { useAuth } from "../../api/auth/AuthContext";
import { useCart } from "../../api/market/CartContext";
import { useOrders } from "../../api/market/OrderContext";
import {
  useNavigate,
  useLocation,
} from "react-router";
import { toast } from "sonner";

import { Button } from "../../components/market/ui/button";
import { Input } from "../../components/market/ui/input";
import { Label } from "../../components/market/ui/label";
import {
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";

import "./Checkout.css";

export default function Checkout() {
  const { user } = useAuth();
  const {
    items,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();
  const { createOrder } = useOrders();

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 다음 주소 API 스크립트 동적 로드
  useEffect(() => {
    const script =
      document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 🔥 directBuyItem 유지
  const directBuyItem =
    location.state?.directBuyItem;

  const checkoutItems = directBuyItem
    ? [directBuyItem]
    : items;
  const checkoutTotalPrice = checkoutItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // 로그인 체크
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/checkout",
          directBuyItem,
        },
      });
    }
  }, [user, navigate]);

  // 장바구니 비었으면 막기
  useEffect(() => {
    if (
      !checkoutItems ||
      checkoutItems.length === 0
    ) {
      navigate("/cart");
    }
  }, [checkoutItems, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    detailAddress: user?.detailAddress || "",
    message: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("kakaopay");
  const [loading, setLoading] = useState(false);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          address: data.address,
        }));
      },
    }).open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error(
        "필수 정보를 모두 입력해주세요"
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const fullAddress =
        `${formData.address} ${formData.detailAddress}`.trim();
      const order = createOrder(
        checkoutItems,
        checkoutTotalPrice,
        fullAddress,
        formData.phone,
        paymentMethod
      );

      sessionStorage.setItem(
        "lastOrderId",
        order.id
      );
      clearCart();

      toast.success("주문이 완료되었습니다!", {
        description: `주문번호: ${order.id}`,
      });
      navigate(`/tracking/${order.id}`);
    }, 900);
  };

  return (
    <div className="checkout-wrapper">
      <header className="checkout-header">
        <div className="header-inner">
          <Button
            variant="ghost"
            className="header-back-btn"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="size-[20px] mr-2" />
            장바구니로 돌아가기
          </Button>
          <h1 className="header-title">
            주문/결제
          </h1>
        </div>
      </header>

      <div className="checkout-content">
        <div className="checkout-grid">
          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                배송 정보
              </h2>

              <InputField
                label="받는 분"
                value={formData.name}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    name: v,
                  })
                }
              />
              <InputField
                label="연락처"
                value={formData.phone}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    phone: v,
                  })
                }
              />

              <div className="checkout-field">
                <Label className="checkout-label">
                  주소
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="checkout-input"
                    value={formData.address}
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={handleAddressSearch}
                  >
                    주소찾기
                  </Button>
                </div>
              </div>

              <InputField
                label="상세 주소"
                value={formData.detailAddress}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    detailAddress: v,
                  })
                }
              />

              <InputField
                label="배송 메시지"
                value={formData.message}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    message: v,
                  })
                }
              />
            </div>

            {/* 결제 수단 */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                결제 수단
              </h2>
              <div className="payment-list">
                {["kakaopay", "tosspay"].map(
                  (method) => (
                    <div
                      key={method}
                      className={`payment-item ${
                        paymentMethod === method
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setPaymentMethod(method)
                      }
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={
                          paymentMethod === method
                        }
                        onChange={() =>
                          setPaymentMethod(method)
                        }
                      />
                      <Label className="payment-label">
                        {method === "kakaopay"
                          ? "💬 카카오페이"
                          : "💳 토스페이"}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 주문 상품 */}
            <div className="checkout-summary">
              <div className="checkout-card sticky-summary">
                <h2 className="checkout-card-title">
                  주문 상품
                </h2>

                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="summary-item"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="summary-img"
                    />
                    <div className="summary-info">
                      <p className="summary-name">
                        {item.name}
                      </p>

                      {/* 🔥 Checkout에서도 수량 조절 */}
                      <div className="summary-qty-row">
                        <button
                          type="button"
                          onClick={() =>
                            directBuyItem
                              ? navigate(
                                  "/product/" +
                                    item.id
                                )
                              : updateQuantity(
                                  item.id,
                                  item.quantity -
                                    1
                                )
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            directBuyItem
                              ? navigate(
                                  "/product/" +
                                    item.id
                                )
                              : updateQuantity(
                                  item.id,
                                  item.quantity +
                                    1
                                )
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="summary-price">
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>
                ))}

                <div className="summary-price-box">
                  <div className="summary-line">
                    <span>상품 금액</span>
                    <span>
                      {checkoutTotalPrice.toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className="summary-line">
                    <span>배송비</span>
                    <span className="free">
                      무료
                    </span>
                  </div>
                  <div className="summary-total">
                    <span>최종 결제금액</span>
                    <span>
                      {checkoutTotalPrice.toLocaleString()}
                      원
                    </span>
                  </div>
                </div>

                <Button
                  className="checkout-pay-btn"
                  disabled={loading}
                >
                  {loading
                    ? "결제 중..."
                    : `${checkoutTotalPrice.toLocaleString()}원 결제하기`}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="checkout-field">
      <Label className="checkout-label">
        {label}
      </Label>
      <Input
        className="checkout-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
