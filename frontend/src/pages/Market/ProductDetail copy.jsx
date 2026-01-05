import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { fetchProductDetail } from "../../api/product/productApi";
import { useAuth } from "../../api/auth/AuthContext";
import { useProducts } from "../../api/market/ProductContext";
import { useCart } from "../../api/market/CartContext";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductDetail() {
  const { user } = useAuth();
  const { productId } = useParams();
  const { addItem: addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [qty, setQty] = useState(1);
  const [showGoCart, setShowGoCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  // 1️⃣ Market에서 넘어온 product 사용
  if (location.state?.product) {
    setProduct(location.state.product);
    setLoading(false);
    return;
  }

  // 2️⃣ 서버에서 DTO 조회
  const loadProduct = async () => {
    try {
      const res = await fetchProductDetail(Number(productId));
      setProduct(res.data); // ⭐ DTO 그대로
    } catch (e) {
      console.error(e);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  loadProduct();
}, [productId, location.state]);


  if (loading) {
    return (
      <div style={{ padding: "120px", textAlign: "center" }}>
        로딩중...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="market-container"
        style={{
          padding: "120px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#253126",
          }}
        >
          상품을 찾을 수 없습니다.
        </h2>
        <button
          className="btn-main"
          style={{ marginTop: "20px" }}
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>
    );
  }

  // 장바구니 담기
  const handleAdd = async () => {
  if (!user) {
    toast.error("로그인이 필요합니다.");
    return navigate("/login", {
      state: { returnTo: `/product/${product.productId}` },
    });
  }

  // 수량 포함하여 장바구니 추가
  try {
    await addToCart({
      productId: product.productId,
      quantity: qty,
    });

       toast.success(`${product.name}이(가) 장바구니에 담겼습니다.`);
    setShowGoCart(true);  //장바구니 이동 버튼 표시
  } catch (e) {
    toast.error("장바구니 담기 실패");
  }
};

  //  바로 주문
const handleBuyNow = async () => {
  if (!user) {
    toast.error("로그인이 필요합니다.");
    return navigate("/login", {
      state: { returnTo: `/product/${product.productId}` },
    });
  }

  try {
    await addToCart({
      productId: product.productId,
      quantity: qty,
    });

    navigate("/checkout");
  } catch (e) {
    toast.error("바로 구매 실패");
  }
};



  return (
    <div
      className="market-container"
      style={{ minWidth: "1200px" }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="btn-main"
          style={{
            background: "#253126",
            marginBottom: "26px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowLeft size={18} />
          뒤로가기
        </button>

        <div
          className="market-card"
          style={{
            padding: "0",
            borderRadius: "26px",
            overflow: "hidden",
          }}
        >
          <div
            className="market-card__image"
            style={{ height: "340px" }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
            />
          </div>

          <div
            className="market-card__body"
            style={{ paddingBottom: "40px" }}
          >
            <h3 style={{ fontSize: "32px" }}>
              {product.name}
            </h3>
            <p className="market-card__type">
              {product.category}
            </p>

            {product.description && (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "16px",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                {product.description}
              </p>
            )}

            {/* DEVICE specs */}
            {product.specs && (
              <ul
                className="device-specs"
                style={{ marginTop: "20px" }}
              >
                {product.specs.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            )}

            {/* CROP stats */}
            {product.stats && (
                <div className="market-card__stats" style={{ marginTop: "26px" }}>
                <div>
                  <span>농장</span>
                  <p>{product.farmName}</p>
                </div>
                <div>
                  <span>시스템</span>
                  <p>{product.systemType}</p>
                </div>
                <div>
                  <span>작물</span>
                  <p>{product.plant}</p>
                </div>
                <div>
                  <span>성장단계</span>
                  <p>{product.stage}</p>
                </div>
                <div>
                  <span>재배일수</span>
                  <p>{product.days}일</p>
                </div>
              </div>

              // <div
              //   className="market-card__stats"
              //   style={{ marginTop: "26px" }}
              // >
              //   {Object.entries(
              //     product.stats
              //   ).map(([key, value]) => (
              //     <div key={key}>
              //       <span>{key}</span>
              //       <p>{value}</p>
              //     </div>
              //   ))}
              // </div>
            )}

            {/* 가격 */}
            <div
              style={{
                marginTop: "30px",
                fontSize: "28px",
                fontWeight: "700",
                color: "#253126",
              }}
            >
              {product.price.toLocaleString()}원
              <small
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#777",
                }}
              >
                1{product.unit} 기준
              </small>
            </div>

            {/* 🔥 수량 조절 박스 */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                className="btn-main"
                style={{ padding: "8px 14px" }}
                onClick={() =>
                  setQty(Math.max(1, qty - 1))
                }
              >
                <Minus size={16} />
              </button>

              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {qty}
              </span>

              <button
                className="btn-main"
                style={{ padding: "8px 14px" }}
                onClick={() => setQty(qty + 1)}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* 버튼 */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                gap: "14px",
              }}
            >
              <button
                className="btn-main"
                onClick={handleAdd}
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ShoppingCart size={18} />
                장바구니 담기
              </button>

              <button
                className="btn-main"
                style={{
                  background: "#acda00",
                  color: "#253126",
                  flex: "1",
                }}
                onClick={handleBuyNow}
              >
                <CheckCircle size={18} />
                바로 구매
              </button>
            </div>

            {/* 🔥 장바구니 이동 버튼 */}
            {showGoCart && (
              <button
                onClick={() => navigate("/cart")}
                className="btn-main"
                style={{
                  marginTop: "20px",
                  background: "#253126",
                  width: "100%",
                }}
              >
                장바구니로 이동 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
