import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// 로그인 여부 판단은 무조건 ProtectedRoute
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // 아직 user 로딩 전이면 아무 것도 안 함
  if (user === undefined) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
