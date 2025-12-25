// src/pages/Cart/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../api/market/CartContext";
import { toast } from "sonner";

import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  /* =========================
     CartContext 상태/함수
  ========================= */
  const {
    cartItems,
    removeItem,
    changeQuantity,
    clearAll,
  } = useCart();

  /* =========================
     총 결제 금액 계산
  ========================= */
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* =========================
     수량 증가
  ========================= */
  const handleIncrease = (item) => {
    changeQuantity(
      item.id, // cartItemId
      item.quantity + 1
    );
  };

  /* =========================
     수량 감소 (1개 이하 방지)
  ========================= */
  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      toast.error("최소 수량은 1개입니다.");
      return;
    }

    changeQuantity(
      item.id, // cartItemId
      item.quantity - 1
    );
  };

  /* =========================
     개별 상품 삭제
  ========================= */
  const handleRemove = (item) => {
    removeItem(item.productId); // CartContext 요구값
    toast.success("상품이 삭제되었습니다.");
  };

  /* =========================
     장바구니 전체 비우기
  ========================= */
  const handleClearAll = () => {
    if (cartItems.length === 0) return;

    clearAll();
    toast.success("장바구니를 비웠습니다.");
  };

  /* =========================
     렌더링
  ========================= */
  return (
    <div className="cart-page">
      {/* ===== 상단 헤더 ===== */}
      <div className="cart-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          뒤로가기
        </button>

        <h2>장바구니</h2>

        {cartItems.length > 0 && (
          <button
            className="clear-btn"
            onClick={handleClearAll}
          >
            <Trash2 size={16} />
            전체 삭제
          </button>
        )}
      </div>

      {/* ===== 장바구니 비어있을 때 ===== */}
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>장바구니가 비어 있습니다.</p>
          <button
            className="btn-main"
            onClick={() => navigate("/market")}
          >
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <>
          {/* ===== 상품 리스트 ===== */}
          <div className="cart-list">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item"
              >
                {/* 상품 이미지 */}
                <img
                  src={item.image}
                  alt={item.productName}
                  className="cart-item-image"
                />

                {/* 상품 정보 */}
                <div className="cart-item-info">
                  <h3>{item.productName}</h3>
                  <p>
                    {item.price.toLocaleString()}
                    원
                  </p>

                  {/* 수량 조절 */}
                  <div className="quantity-box">
                    <button
                      onClick={() =>
                        handleDecrease(item)
                      }
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleIncrease(item)
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  className="remove-btn"
                  onClick={() =>
                    handleRemove(item)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* ===== 하단 결제 영역 ===== */}
          <div className="cart-footer">
            <div className="total-price">
              <span>총 결제 금액</span>
              <strong>
                {totalPrice.toLocaleString()}원
              </strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              결제하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
