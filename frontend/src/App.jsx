import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// =============================
// 공통 레이아웃
// =============================
import BasicLayout from "./layouts/layout/BasicLayout";
import Header from "./layouts/header/Header";

// =============================
// Providers
// =============================
import {
  AuthProvider,
  useAuth,
} from "./api/auth/AuthContext";
import { ProductProvider } from "./api/market/ProductContext";
import { CartProvider } from "./api/market/CartContext";
import { OrderProvider } from "./api/market/OrderContext";
import { ReviewProvider } from "./api/market/ReviewContext";
import { NotificationProvider } from "./api/market/NotificationContext";

// =============================
// 기본 페이지
// =============================
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";
import Alerts from "./pages/Alerts/Alerts";

// 로그인 / 회원가입
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";

// ID/PW 찾기
import FindIdPw from "./pages/Login/FindIdPw";
import IDFindPage from "./pages/Login/IDFindPage";
import PWFindVerify from "./pages/Login/PWFindVerify";
import PWFindReset from "./pages/Login/PWFindReset";

// 테스트
import TestHome from "./pages/Login/TestHome";
import AdminHome from "./pages/Login/AdminHome";

// =============================
// Market
// =============================
import Market from "./pages/Market/Market"; // 마켓 메인 페이지
import ProductDetail from "./pages/Market/ProductDetail"; // 상품 상세 페이지
import Cart from "./pages/Market/Cart"; // 장바구니 페이지
import OrderHistory from "./pages/Market/OrderHistory"; // 주문 내역 페이지
import OrderTracking from "./pages/Market/OrderTracking"; // 주문 추적 페이지
import Notifications from "./pages/Market/Notifications"; // 알림 페이지

// =============================
// Payment
// =============================
import Checkout from "./pages/Market/Checkout"; // 결제 페이지
import PaymentSuccess from "./pages/Market/PaymentSuccess"; // 결제 성공 페이지
import PaymentFail from "./pages/Market/PaymentFail"; // 결제 실패 페이지
import PaymentCancel from "./pages/Market/PaymentCancel"; // 결제 취소 페이지
import OrderComplete from "./pages/Market/OrderComplete"; // 주문 완료 페이지

// =============================
// Admin
// =============================
import AdminDashboard from "./pages/Admin/AdminDashboard"; // 관리자 대시보드
import ProductManagement from "./pages/Admin/ProductManagement"; // 상품 관리
import OrderManagement from "./pages/Admin/OrderManagement"; // 주문 관리

// =============================
// MyPage
// =============================
import MyPage from "./pages/MyPage/MyPage";
import MyPageView from "./pages/MyPage/MyPageView";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import MyPageTimelapse from "./pages/MyPage/MyPageTimelapse";

// Header Dropdown
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Profile/Settings";
import History from "./pages/Profile/History";

// 🔒 PrivateRoute
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <ReviewProvider>
              <NotificationProvider>
                <Header />

                <Routes>
                  {/* 기본 */}
                  <Route
                    path="/"
                    element={
                      <BasicLayout>
                        <Home />
                      </BasicLayout>
                    }
                  />
                  <Route
                    path="/plants"
                    element={
                      <BasicLayout>
                        <PlantManage />
                      </BasicLayout>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={<Alerts />}
                  />

                  {/* 로그인 */}
                  <Route
                    path="/login"
                    element={<Login />}
                  />
                  <Route
                    path="/signup"
                    element={<Signup />}
                  />

                  {/* ID/PW */}
                  <Route
                    path="/find"
                    element={<FindIdPw />}
                  />
                  <Route
                    path="/find/id"
                    element={<IDFindPage />}
                  />
                  <Route
                    path="/find/pw/verify"
                    element={<PWFindVerify />}
                  />
                  <Route
                    path="/find/pw/reset"
                    element={<PWFindReset />}
                  />

                  {/* 테스트 */}
                  <Route
                    path="/wootest"
                    element={<TestHome />}
                  />
                  <Route
                    path="/admin-test"
                    element={<AdminHome />}
                  />

                  {/* MARKET */}
                  <Route
                    path="/market"
                    element={<Market />}
                  />
                  <Route
                    path="/products"
                    element={<Market />}
                  />
                  <Route
                    path="/product/:productId"
                    element={<ProductDetail />}
                  />
                  <Route
                    path="/cart"
                    element={<Cart />}
                  />

                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/payment/success"
                    element={<PaymentSuccess />}
                  />
                  <Route
                    path="/payment/fail"
                    element={<PaymentFail />}
                  />
                  <Route
                    path="/payment/cancel"
                    element={<PaymentCancel />}
                  />
                  <Route
                    path="/orders/complete/:orderId"
                    element={<OrderComplete />}
                  />

                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <OrderHistory />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tracking/:orderId"
                    element={
                      <PrivateRoute>
                        <OrderTracking />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/notifications"
                    element={<Notifications />}
                  />

                  {/* Header Dropdown */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <PrivateRoute>
                        <History />
                      </PrivateRoute>
                    }
                  />

                  {/* MY PAGE */}
                  <Route
                    path="/mypage"
                    element={<MyPage />}
                  >
                    <Route
                      index
                      element={<MyPageView />}
                    />
                    <Route
                      path="view"
                      element={<MyPageView />}
                    />
                    <Route
                      path="edit"
                      element={<MyPageEdit />}
                    />
                    <Route
                      path="timelapse"
                      element={
                        <MyPageTimelapse />
                      }
                    />
                  </Route>

                  {/* 관리자 */}
                  <Route path="/admin">
                    <Route
                      index
                      element={<AdminDashboard />}
                    />
                    <Route
                      path="products"
                      element={
                        <ProductManagement />
                      }
                    />
                    <Route
                      path="orders"
                      element={
                        <OrderManagement />
                      }
                    />
                  </Route>
                </Routes>
              </NotificationProvider>
            </ReviewProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
