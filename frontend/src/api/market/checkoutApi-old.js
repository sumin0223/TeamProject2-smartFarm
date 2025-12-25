// import axiosInstance from "../axiosInstance";
// import requests from "../requests";

// /* =========================
//    CHECKOUT API
//    ========================= */

// /**
//  * 바로 주문 (상품 상세 → 바로 결제)
//  * @param {Object} data
//  * data = {
//  *   items: [{ productId, quantity }],
//  *   deliveryAddress,
//  *   phoneNumber,
//  *   paymentMethod
//  * }
//  */
// export const checkoutDirect = (data) => {
//   return axiosInstance.post(
//     requests.checkoutDirect,
//     data
//   );
// };

// /**
//  * 장바구니 주문
//  * @param {Object} data
//  * data = {
//  *   deliveryAddress,
//  *   phoneNumber,
//  *   paymentMethod
//  * }
//  */
// export const checkoutFromCart = (data) => {
//   return axiosInstance.post(
//     requests.checkoutFromCart,
//     data
//   );
// };
