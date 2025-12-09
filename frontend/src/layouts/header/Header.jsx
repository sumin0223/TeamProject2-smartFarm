import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.css";

export default function Header({ user }) {
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const location = useLocation();

  /* ----------------------------------------
    1) URL 변화 → 어떤 메뉴가 활성화인지 판단
  ---------------------------------------- */
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/mypage")) setActiveMenu("mypage");
    else if (path.startsWith("/plants")) setActiveMenu("plants");
    else if (path.startsWith("/market")) setActiveMenu("market");
    else if (path.startsWith("/alerts")) setActiveMenu("alerts");
    else setActiveMenu(null);

    setOpenProfileMenu(false);
  }, [location.pathname]);

  /* ----------------------------------------
    2) 프로필 드롭다운 외부 클릭 → 닫기
  ---------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ----------------------------------------
    3) SUBMENU 외부 이동 시 닫기
  ---------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        if (!location.pathname.startsWith("/mypage")) setActiveMenu(null);
      }
    };
    document.addEventListener("mouseover", handler);
    return () => document.removeEventListener("mouseover", handler);
  }, [location.pathname]);

  return (
    <header className="nova-header">
      <div className="nova-header-inner">

        {/* 로고 */}
        <Link to="/" className="header-logo">
          <img src="/logo.svg" alt="logo" className="logo-img" />
        </Link>

        {/* 네비게이션 */}
        <nav className="nova-nav" ref={navRef}>
          <Link to="/" className="nav-item">홈</Link>
          <Link to="/plants" className="nav-item">내 식물 관리</Link>

          <button
            className="nav-item no-style-btn"
            onMouseEnter={() => setActiveMenu("mypage")}
          >
            마이페이지
          </button>

          <Link to="/market" className="nav-item">팜 마켓</Link>
          <Link to="/alerts" className="nav-item">알림</Link>
        </nav>

        {/* 마이페이지 서브메뉴 */}
        <div className="submenu-zone">
          {activeMenu === "mypage" && (
            <div
              className="submenu fade"
              onMouseEnter={() => setActiveMenu("mypage")}
              onMouseLeave={() => {
                if (!location.pathname.startsWith("/mypage")) {
                  setActiveMenu(null);
                }
              }}
            >
              <Link to="/mypage/view">프로필 관리</Link>
              <Link to="/mypage/edit">프로필 수정</Link>
              <Link to="/mypage/timelapse">타임 랩스</Link>
            </div>
          )}
        </div>

        {/* 우측 유저 영역 */}
        <div className="user-area" ref={dropdownRef}>
          {user ? (
            <>
              <button
                className="user-dropdown-btn"
                onClick={() => setOpenProfileMenu((prev) => !prev)}
              >
                <img
                  src={user.profileImg || "/mockups/profile-photo.svg"}
                  className="user-img"
                  alt="profile"
                />
                <span className="user-name">{user.name}</span>
                <span className="arrow">▾</span>
              </button>

              {openProfileMenu && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">프로필 보기</Link>
                  <Link to="/settings" className="dropdown-item">설정</Link>
                  <Link to="/history" className="dropdown-item">내 히스토리</Link>

                  <div className="menu-divider" />

                  <button className="logout-btn dropdown-item">
                    로그아웃 ﹥
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="login-btn">로그인</Link>
          )}
        </div>

      </div>
    </header>
  );
}








// import { Link, useLocation } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import "./Header.css";

// function Header({ user }) {
//   const [openMenu, setOpenMenu] = useState(false);
//   const [activeMenu, setActiveMenu] = useState(null);

//   const navRef = useRef();
//   const dropdownRef = useRef();
//   const location = useLocation();

//   // URL 기반 서브메뉴 활성화
//   useEffect(() => {
//     if (location.pathname.startsWith("/mypage")) {
//       setActiveMenu("mypage");
//     } else if (location.pathname.startsWith("/plants")) {
//       setActiveMenu("plants");
//     } else if (location.pathname.startsWith("/market")) {
//       setActiveMenu("market");
//     } else if (location.pathname.startsWith("/alerts")) {
//       setActiveMenu("alerts");
//     } else {
//       setActiveMenu(null);
//     }
//   }, [location.pathname]);

//   // 드롭다운 외부 클릭 닫기
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenMenu(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 네비게이션 외부 이동 시 서브메뉴 닫기
//   useEffect(() => {
//     function handleNavOutside(e) {
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         // 현재 경로가 아닌 경우만 닫기
//         if (!location.pathname.startsWith("/mypage")) {
//           setActiveMenu(null);
//         }
//       }
//     }
//     document.addEventListener("mouseover", handleNavOutside);
//     return () => document.removeEventListener("mouseover", handleNavOutside);
//   }, [location.pathname]);

//   return (
//     <header className="nova-header">
//       <div className="nova-header-inner">

//         {/* 로고 */}
//         <Link to="/" className="header-logo">
//           <img src="/logo.svg" alt="logo" className="logo-img" />
//         </Link>

//         {/* 네비 */}
//         <nav className="nova-nav" ref={navRef}>
//           <Link to="/" className="nav-item">홈</Link>

//           <Link to="/plants" className="nav-item">내 식물 관리</Link>

//           <button
//             className="nav-item no-style-btn"
//             onMouseEnter={() => setActiveMenu("mypage")}
//           >
//             마이페이지
//           </button>

//           <Link to="/market" className="nav-item">팜 마켓</Link>

//           <Link to="/alerts" className="nav-item">알림</Link>
//         </nav>

//         {/* 서브메뉴 */}
//         <div className="submenu-zone">
//           {activeMenu === "mypage" && (
//             <div
//               className="submenu fade"
//               onMouseEnter={() => setActiveMenu("mypage")}
//               onMouseLeave={() => {
//                 if (!location.pathname.startsWith("/mypage")) {
//                   setActiveMenu(null);
//                 }
//               }}
//             >
//               <Link to="/mypage/view">프로필 관리</Link>
//               <Link to="/mypage/edit">프로필 수정</Link>
//               <Link to="/mypage/timelapse">타임 랩스</Link>
//             </div>
//           )}
//         </div>

//         {/* 사용자 영역 */}
//         <div className="user-area" ref={dropdownRef}>
//           {user ? (
//             <>
//               <button
//                 className="user-dropdown-btn"
//                 onClick={() => setOpenMenu((prev) => !prev)}
//               >
//                 <img
//                   src={user.profileImg || "/mockups/profile-photo.svg"}
//                   alt="프로필"
//                   className="user-img"
//                 />
//                 <span className="user-name">{user.name}</span>
//                 <span className="arrow">▾</span>
//               </button>

//               {openMenu && (
//                 <div className="dropdown-menu">
//                   <Link to="/profile" className="dropdown-item">프로필 보기</Link>
//                   <Link to="/settings" className="dropdown-item">설정</Link>
//                   <Link to="/history" className="dropdown-item">내 히스토리</Link>

//                   <div className="menu-divider"></div>

//                   <button className="logout-btn dropdown-item">
//                     로그아웃 ﹥
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <Link to="/login" className="login-btn">로그인</Link>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// }

// export default Header;
