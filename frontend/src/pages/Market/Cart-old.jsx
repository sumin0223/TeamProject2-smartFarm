import { useCart } from "../../api/market/CartContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import "./Cart.css";

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  // ===== Quantity Animation Trigger =====
  const triggerQtyAnimation = (id) => {
    const el = document.querySelector(
      `#qty-${id}`
    );
    if (!el) return;
    el.classList.add("qty-anim");
    setTimeout(
      () => el.classList.remove("qty-anim"),
      200
    );
  };

  // ===== Total Price Animation Trigger =====
  const triggerTotalPriceAnimation = () => {
    const el = document.querySelector(
      "#total-price"
    );
    if (!el) return;
    el.classList.add("active");
    setTimeout(
      () => el.classList.remove("active"),
      250
    );
  };

  // 안전한 수량 변경
  const safeUpdateQty = (id, qty) => {
    if (qty < 1) return; // 1 이하 방지
    updateQuantity(id, qty);
    triggerQtyAnimation(id);
    triggerTotalPriceAnimation();
  };

  // 안전 삭제
  const safeRemove = (id) => {
    const el = document.querySelector(
      `#cart-item-${id}`
    );

    if (el) {
      el.classList.add("cart-item-fadeout");
      setTimeout(() => {
        removeFromCart(id);
        toast.success(
          "상품이 장바구니에서 제거되었습니다."
        );
        triggerTotalPriceAnimation();
      }, 300);
    } else {
      removeFromCart(id);
      triggerTotalPriceAnimation();
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-container">
        {/* 뒤로가기 */}
        <div className="cart-header-inner">
          <button
            className="back-btn"
            onClick={() => navigate("/market")}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>
        </div>

        <div className="cart-empty-box">
          <p className="cart-empty-text">
            장바구니가 비어있습니다
          </p>

          <button
            className="cart-continue-btn"
            onClick={() => navigate("/market")}
          >
            <ArrowLeft size={18} />
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <header className="cart-header">
        <div className="cart-header-inner">
          <button
            className="cart-back-btn"
            onClick={() => navigate("/market")}
          >
            <ArrowLeft size={20} />
            쇼핑 계속하기
          </button>

          <h1 className="cart-title">장바구니</h1>
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout">
          {/* ITEMS */}
          <div className="cart-items">
            {items.map((item) => (
              <div
                className="cart-card"
                key={item.id}
                id={`cart-item-${item.id}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-card-img"
                />

                <div className="cart-card-info">
                  <h3 className="cart-card-title">
                    {item.category === "device"
                      ? item.name
                      : item.farmName}
                  </h3>

                  <p className="cart-card-sub">
                    {item.category === "service"
                      ? "타임랩스 촬영 서비스"
                      : item.category === "device"
                      ? item.farmName
                      : item.plant}
                  </p>

                  <p className="cart-card-unit">
                    {item.unit}{" "}
                    {item.category === "service"
                      ? "구독"
                      : "기준"}
                  </p>

                  {/* Quantity */}
                  <div className="cart-qty-row">
                    <div className="cart-qty-box">
                      <button
                        onClick={() =>
                          safeUpdateQty(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <span id={`qty-${item.id}`}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          safeUpdateQty(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="cart-card-price">
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                      원
                    </p>
                  </div>
                </div>

                {/* 삭제 */}
                <button
                  className="cart-remove-btn"
                  onClick={() =>
                    safeRemove(item.id)
                  }
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h2>주문 요약</h2>

            <div className="cart-summary-list">
              <div>
                <span>상품 수량</span>
                <span>{totalItems}개</span>
              </div>

              <div>
                <span>상품 금액</span>
                <span>
                  {totalPrice.toLocaleString()}원
                </span>
              </div>

              <div>
                <span>배송비</span>
                <span className="free">무료</span>
              </div>

              <hr />

              <div className="cart-summary-total">
                <span>총 결제금액</span>
                <span
                  id="total-price"
                  className="cart-price-anim"
                >
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <button
              className="cart-order-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
