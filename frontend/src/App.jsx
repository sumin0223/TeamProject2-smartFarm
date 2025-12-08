// =============================
// 우영 App.jsx (로그인 + ID/PW 찾기 시스템 + 팀장 레이아웃 통합본)
// =============================

import { Routes, Route } from "react-router-dom";
import "./App.css";

// -----------------------------
// 팀장님 기존 페이지
// -----------------------------
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";

// -----------------------------
// 팀장님 레이아웃 & 헤더
// -----------------------------
import BasicLayout from "./layouts/layout/BasicLayout";
import Header from "./wooyoung_login/layouts/header/Header"; // 🔥 우영 헤더 유지

// -----------------------------
// Auth Provider (우영 기능 유지)
// -----------------------------
import { AuthProvider } from "./wooyoung_login/auth/AuthContext";

// -----------------------------
// 로그인 / 회원가입
// -----------------------------
import Login from "./wooyoung_login/pages/Login";
import Signup from "./wooyoung_login/pages/Signup";

// -----------------------------
// ID/PW 찾기
// -----------------------------
import FindIdPw from "./wooyoung_login/pages/FindIdPw";
import IDFindPage from "./wooyoung_login/pages/IDFindPage";
import PWFindVerify from "./wooyoung_login/pages/PWFindVerify";
import PWFindReset from "./wooyoung_login/pages/PWFindReset";

// -----------------------------
// 테스트 페이지
// -----------------------------
import TestHome from "./wooyoung_login/pages/TestHome";

function App() {
  return (
    <AuthProvider>
      {/* 🔥 우영 헤더 → 로그인 상태 반영 */}
      <Header />

      <Routes>
        {/* -------------------------
            팀장 페이지 + 레이아웃 적용
        -------------------------- */}
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

        {/* -------------------------
            로그인 / 회원가입
        -------------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* -------------------------
            ID / PW 찾기
        -------------------------- */}
        <Route path="/find" element={<FindIdPw />} />
        <Route path="/find/id" element={<IDFindPage />} />
        <Route path="/find/pw/verify" element={<PWFindVerify />} />
        <Route path="/find/pw/reset" element={<PWFindReset />} />

        {/* -------------------------
            테스트 페이지
        -------------------------- */}
        <Route path="/wootest" element={<TestHome />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
