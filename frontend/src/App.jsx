import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/market/ui/sonner";

import "./App.css";

// Layout
import BasicLayout from "./layouts/layout/BasicLayout";
import Header from "./layouts/header/Header";

// Providers
import { AuthProvider, useAuth } from "./api/auth/AuthContext";
import { ProductProvider } from "./api/market/ProductContext";
import { CartProvider } from "./api/market/CartContext";
import { OrderProvider } from "./api/market/OrderContext";
import { ReviewProvider } from "./api/market/ReviewContext";
import { NotificationProvider } from "./api/market/NotificationContext";
import { AlarmProvider } from "./sse/AlarmContext";

// Pages
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";
import NeedLogin from "./pages/PlantManage/NeedLogin";
import Alerts from "./pages/Alerts/Alerts";
import AlarmPage from "./pages/Alerts/AlarmPage";

// Login / Signup
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import FindIdPw from "./pages/Login/FindIdPw";
import IDFindPage from "./pages/Login/IDFindPage";
import PWFindVerify from "./pages/Login/PWFindVerify";
import PWFindReset from "./pages/Login/PWFindReset";

// Test / Admin
import TestHome from "./pages/Login/TestHome";
import AdminHome from "./pages/Login/AdminHome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import OrderManagement from "./pages/Admin/OrderManagement";

// Market
import Market from "./pages/Market/Market";
import ProductDetail from "./pages/Market/ProductDetail";
import Cart from "./pages/Market/Cart";
import Checkout from "./pages/Market/Checkout";
import PaymentSuccess from "./pages/Market/SuccessPayment";
import PaymentFail from "./pages/Market/PaymentFail";
import OrderHistory from "./pages/Market/OrderHistory";
import OrderTracking from "./pages/Market/OrderTracking";
import Notifications from "./pages/Market/Notifications";

// MyPage
import MyPage from "./pages/MyPage/MyPage";
import MyPageView from "./pages/MyPage/MyPageView";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import MyPageTimelapse from "./pages/MyPage/MyPageTimelapse";

// Profile
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Profile/Settings";
import History from "./pages/Profile/History";

// 🔒 Private Route
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <ReviewProvider>
                <NotificationProvider>
                  <AlarmProvider>
                    <Header />
                    <Toaster position="top-right" richColors closeButton />

                    <Routes>
                      {/* 기본 페이지 */}
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
                      <Route path="/plants/need-login" element={<NeedLogin />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route
                        path="/alarm"
                        element={
                          <PrivateRoute>
                            <BasicLayout>
                              <AlarmPage />
                            </BasicLayout>
                          </PrivateRoute>
                        }
                      />

                      {/* 로그인 / 회원가입 */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      {/* ID/PW 찾기 */}
                      <Route path="/find" element={<FindIdPw />} />
                      <Route path="/find/id" element={<IDFindPage />} />
                      <Route path="/find/pw/verify" element={<PWFindVerify />} />
                      <Route path="/find/pw/reset" element={<PWFindReset />} />

                      {/* 테스트 / 관리자 */}
                      <Route path="/wootest" element={<TestHome />} />
                      <Route path="/admin-test" element={<AdminHome />} />

                      {/* 관리자 패널 */}
                      <Route path="/admin">
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                      </Route>

                      {/* 마켓 */}
                      <Route path="/market" element={<Market />} />
                      <Route path="/products" element={<Market />} />
                      <Route path="/product/:productId" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/success-payment" element={<PaymentSuccess />} />
                      <Route path="/fail-payment" element={<PaymentFail />} />
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
                      <Route path="/notifications" element={<Notifications />} />

                      {/* MyPage */}
                      <Route
                        path="/mypage"
                        element={
                          <PrivateRoute>
                            <MyPage />
                          </PrivateRoute>
                        }
                      >
                        <Route index element={<MyPageView />} />
                        <Route path="view" element={<MyPageView />} />
                        <Route path="edit" element={<MyPageEdit />} />
                        <Route path="timelapse" element={<MyPageTimelapse />} />
                      </Route>

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
                    </Routes>
                  </AlarmProvider>
                </NotificationProvider>
              </ReviewProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
