import backendServer from "../backendServer";

/* =========================
   CART API
========================= */

// 장바구니 조회
export const fetchCartItems = () =>
  backendServer.get("/api/cart/items");

// 장바구니 상품 추가
export const addCartItem = (data) =>
  backendServer.post("/api/cart/items", data);

// 장바구니 수량 수정
export const updateCartItemQuantity = (cartItemId, quantity) =>
  backendServer.put(
    `/api/cart/items/${cartItemId}`,
    null,
    { params: { quantity } }
  );

// 장바구니 상품 삭제
export const deleteCartItem = (cartItemId) =>
  backendServer.delete(`/api/cart/items/${cartItemId}`);

// 장바구니 비우기
export const clearCart = () =>
  backendServer.delete("/api/cart/clear");
