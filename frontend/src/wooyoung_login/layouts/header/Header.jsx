// ==============================
// 우영 - Header.jsx (최종수정본)
// ==============================
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function close(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="nova-header">
      <div className="nova-header-inner">
        {/* 로고 */}
        <Link to="/" className="header-logo">
          <img src="/logo.svg" alt="logo" className="logo-img" />
        </Link>

        {/* 네비게이션 */}
        <nav className="nova-nav">
          <Link to="/" className="nav-item">
            홈
          </Link>
          <Link to="/plants" className="nav-item">
            내 식물 관리
          </Link>
          <Link to="/market" className="nav-item">
            팜 마켓
          </Link>
          <Link to="/alerts" className="nav-item">
            알림
          </Link>
        </nav>

        {/* 우측 사용자 */}
        <div className="user-area" ref={dropdownRef}>
          {user ? (
            <>
              {/* 로그인 후 메뉴 */}
              <button className="user-dropdown-btn" onClick={() => setOpen((p) => !p)}>
                <img
                  src={user.profileImg || "/mockups/woo-default-profile.svg"}
                  alt="프로필"
                  className="user-img"
                />
                <span className="user-name">{user.name}</span>
                <span className="arrow">▾</span>
              </button>

              {open && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    프로필 보기
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    설정
                  </Link>
                  <Link to="/history" className="dropdown-item">
                    나의 히스토리
                  </Link>

                  <div className="menu-divider"></div>

                  <button className="logout-btn" onClick={logout}>
                    로그아웃 ﹥
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* 로그인 전 아이콘 */}
              <button className="user-icon-btn" onClick={() => setOpen((p) => !p)}>
                <img src="/mockups/woo-user-icon.svg" alt="로그인" className="user-icon" />
              </button>

              {open && (
                <div className="dropdown-menu login-dropdown">
                  <Link to="/login" className="dropdown-item">
                    로그인
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
