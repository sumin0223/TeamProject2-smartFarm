import { RouterProvider } from "react-router-dom";
import { router } from "./utils/routes";

import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <ReviewProvider>
              <NotificationProvider>

                {/* ★ Header는 RootLayout 안으로 이동했으므로 제거됨 */}
                <RouterProvider router={router} />

                <Toaster position="top-right" />

              </NotificationProvider>
            </ReviewProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}








// // src/App.jsx

// import { RouterProvider } from "react-router-dom";
// import { router } from "./utils/routes";

// // === Context Providers ===
// import { AuthProvider } from "./contexts/AuthContext";
// import { ProductProvider } from "./contexts/ProductContext";
// import { CartProvider } from "./contexts/CartContext";
// import { OrderProvider } from "./contexts/OrderContext";
// import { ReviewProvider } from "./contexts/ReviewContext";
// import { NotificationProvider } from "./contexts/NotificationContext";

// // === Layout / UI ===
// import Header from "./layouts/header/Header";
// import { Toaster } from "./components/ui/sonner";

// // 임시 로그인 정보 (원하면 AuthContext로 대체 가능)
// const mockUser = {
//   name: "테스트 유저",
//   role: "일반회원",
//   profileImg: "/test-user.png",
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <ProductProvider>
//         <CartProvider>
//           <OrderProvider>
//             <ReviewProvider>
//               <NotificationProvider>

//                 {/* 글로벌 Header */}
//                 <Header user={mockUser} />

//                 {/* 라우터 */}
//                 <RouterProvider router={router} />

//                 {/* 알람 (Toaster) */}
//                 <Toaster position="top-right" />

//               </NotificationProvider>
//             </ReviewProvider>
//           </OrderProvider>
//         </CartProvider>
//       </ProductProvider>
//     </AuthProvider>
//   );
// }
