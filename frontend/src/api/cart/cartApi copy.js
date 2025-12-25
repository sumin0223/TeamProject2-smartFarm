import backendServer from "../backendServer";
import requests from "../request";

/* =========================
   CART API
   ========================= */

/** 장바구니 상품 추가 */
export const addToCart = (data) => {
  // data: { userId, productId, quantity }
  return backendServer.post(
    requests.cartAdd,
    data
  );
};

/** 장바구니 상품 제거 */
export const removeFromCart = (data) => {
  // data: { userId, productId }
  return backendServer.post(
    requests.cartRemove,
    data
  );
};

/** 장바구니 수량 변경 */
export const updateCartQuantity = (data) => {
  // data: { cartItemId, quantity }
  return backendServer.post(
    requests.cartUpdate,
    data
  );
};

/** 장바구니 비우기 */
export const clearCart = (data) => {
  // data: { userId }
  return backendServer.post(
    requests.cartClear,
    data
  );
};

/** 장바구니 조회 */
export const fetchCart = (data) => {
  // data: { userId }
  return backendServer.post(
    requests.cartList,
    data
  );
};
