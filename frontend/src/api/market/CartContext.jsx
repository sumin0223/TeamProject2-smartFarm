import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartQuantity,
  clearCart,
  fetchCart,
} from "../cart/cartApi";

import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  /* =========================
     장바구니 조회
     ========================= */
  const loadCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      const res = await fetchCart({
        userId: user.id,
      });
      setItems(res.data || []);
    } catch (e) {
      console.error("장바구니 조회 실패", e);
      setItems([]);
    }
  };

  /* =========================
     상품 담기 (Market 기준)
     ========================= */
  const addToCart = async ({
    userId,
    productId,
    quantity = 1,
  }) => {
    try {
      await addToCartAPI({
        userId,
        productId,
        quantity,
      });

      toast.success("장바구니에 담겼습니다.");
      loadCart();
    } catch (e) {
      toast.error("장바구니 담기 실패");
      console.error(e);
    }
  };

  /* =========================
     수량 변경
     ========================= */
  const updateQuantity = async ({
    cartItemId,
    quantity,
  }) => {
    try {
      await updateCartQuantity({
        cartItemId,
        quantity,
      });
      loadCart();
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================
     아이템 삭제
     ========================= */
  const removeFromCart = async ({
    cartItemId,
  }) => {
    try {
      await removeFromCartAPI({
        cartItemId,
      });
      loadCart();
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================
     전체 비우기
     ========================= */
  const clearAll = async () => {
    try {
      await clearCart({
        userId: user.id,
      });
      setItems([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearAll,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);
