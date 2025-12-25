// 백앤드 통신을 하기 위해서 필요한 백앤드 쪽 path - 공통 path를 분리하고 남은 나머지 path들
const requests = {
  myPageView: "/mypage/view",
  myPageEdit: "/mypage/edit",
  novaList: "/nova/list",
  farmCardList: "/farm/list",
  myPageTimelapse: "/maypage/timelapse",
  timelapseCreate: "/timelapse/create",
  timelapseInfo: "/timelapse/info",
  presetList: "/preset/list",
  presetStep: "/preset/step",
  farmCreate: "/farm/create",
  timelapseView: "/timelapse/view",
  myPageCheckPassword: "/mypage/checkpassword",
  farmDashboard: "/farm/dashboard",
  waterPlantManual: "/actuator/water",
  getAllAlarms: "/alarm/all",
  getUnreadAlarms: "/alarm/unread",
  readAllAlarms: "/alarm/read-all",

  /* ===== PRODUCT (USER) ===== */
  productList: "/products",
  productDetail: (productId) =>
    `/products/${productId}`,

  /* ===== PRODUCT (ADMIN) ===== */
  adminProductList: "/admin/products",
  adminProductDetail: (productId) =>
    `/admin/products/${productId}`,

  /* ===== CART ===== */
  // cartAdd: "/api/cart/items",
  // cartRemove: "/api/cart/remove",
  // cartUpdate: "/api/cart/update",
  // cartClear: "/api/cart/clear",
  // cartList: "/api/cart/items",

  /* ===== CHECKOUT ===== */
  checkoutDirect: "/checkout/direct",
  checkoutFromCart: "/checkout/cart",

  /* ===== KAKAO PAY ===== */
  kakaoPayReady: "/payment/kakao/ready",
  kakaoPayApprove: "/payment/kakao/approve",
  kakaoPaySuccess: "/payment/kakao/success",
  kakaoPayCancel: "/payment/kakao/cancel",
  kakaoPayFail: "/payment/kakao/fail",
};

export default requests;
