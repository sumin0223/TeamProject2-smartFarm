// src/pages/Market/Market.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProducts } from "../../api/market/ProductContext";
import { useCart } from "../../api/market/CartContext";
import { useAuth } from "../../api/auth/AuthContext";

import {
  Search,
  Info,
  ShoppingCart,
  Package,
  Bell,
  LogOut,
  Cpu,
  PlusCircle,
  Video,
} from "lucide-react";

import { toast } from "sonner";
import "./Market.css";

export default function Market() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] =
    useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [viewMode, setViewMode] =
    useState("large");

  /* 검색 + 카테고리 필터 */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        p.name?.toLowerCase().includes(q) ||
        p.farmName?.toLowerCase().includes(q) ||
        p.plant?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" ||
        p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // const filteredProducts = useMemo(() => {
  //   return products.filter((p) => {
  //     const q = searchQuery.toLowerCase();

  //     const matchesSearch =
  //       p.name.toLowerCase().includes(q) ||
  //       p.farmName.toLowerCase().includes(q) ||
  //       (p.plant &&
  //         p.plant.toLowerCase().includes(q));

  //     const matchesCategory =
  //       selectedCategory === "all" ||
  //       p.category === selectedCategory;

  //     return matchesSearch && matchesCategory;
  //   });
  // }, [products, searchQuery, selectedCategory]);

  const categories = [
    { id: "all", label: "전체" },
    { id: "CROP", label: "작물" },
    { id: "DEVICE", label: "기기" },
    { id: "SERVICE", label: "서비스" },
    { id: "NOVA", label: "노바" },
  ];

  //담기 버튼
  // const handleBuy = (product) => {
  //   addToCart(product);
  //   alert(
  //     `${product.name}이(가) 장바구니에 담겼습니다.`
  //   );
  // };
  const handleBuy = async (product) => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return navigate("/login");
    }

    try {
      await addToCart({
        userId: user.id,
        productId: product.productId,
        quantity: 1,
      });

      alert(
        `${product.name}이(가) 장바구니에 담겼습니다.`
      );
      // toast.success(
      //   `${product.name}이(가) 장바구니에 담겼습니다.`
      // );
    } catch (e) {
      // toast.error("장바구니 담기 실패");
    }
  };

  // 상세 보기
  const handleViewDetail = (product) =>
    navigate(`/product/${product.productId}`, {
      state: { product },
    });

  // ⭐ 타임랩스 → 바로 주문 기능으로 변경
  // const handleBuyNow = (product) => {
  //   if (!user) {
  //     toast.error(
  //       "로그인이 필요한 서비스입니다."
  //     );
  //     return navigate("/login", {
  //       state: {
  //         returnTo: `/product/${product.id}`,
  //       },
  //     });
  //   }

  //   addToCart(product); // 장바구니 담기
  //   navigate("/checkout"); // 바로 구매로 이동
  // };
  const handleBuyNow = async (product) => {
    if (!user) {
      toast.error(
        "로그인이 필요한 서비스입니다."
      );
      return navigate("/login", {
        state: { returnTo: "/checkout" },
      });
    }

    await addToCart({
      userId: user.id,
      productId: product.productId,
      quantity: 1,
    });

    navigate("/checkout");
  };

  return (
    <div className="market-container">
      <section className="market-hero">
        <h2>스마트팜 마켓</h2>
        <p>
          스마트팜 IoT / 작물 / 서비스까지 한
          곳에서
        </p>
      </section>

      {/* 검색 */}
      <div className="market-search-area">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="상품명, 팜 이름 검색..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>

        {/* 카테고리 */}
        <div className="category-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${
                selectedCategory === cat.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(cat.id)
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 크게보기 / 작게보기 */}
        <div className="viewmode-toggle">
          <button
            className={`view-btn ${
              viewMode === "large" ? "active" : ""
            }`}
            onClick={() => setViewMode("large")}
          >
            크게보기
          </button>
          <button
            className={`view-btn ${
              viewMode === "small" ? "active" : ""
            }`}
            onClick={() => setViewMode("small")}
          >
            작게보기
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <section
        className={`market-grid ${
          viewMode === "small"
            ? "grid-small"
            : "grid-large"
        }`}
      >
        {filteredProducts.map((p) => {
          if (p.category === "device")
            return (
              <DeviceCard
                key={p.id}
                product={p}
                onAddToCart={handleBuy}
                onViewDetail={handleViewDetail}
                onBuyNow={handleBuyNow}
                viewMode={viewMode}
              />
            );

          if (p.category === "service")
            return (
              <ServiceCard
                key={p.id}
                product={p}
                onAddToCart={handleBuy}
                viewMode={viewMode}
              />
            );

          return (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={handleBuy}
              onBuyNow={handleBuyNow}
              onViewDetail={handleViewDetail}
              viewMode={viewMode}
            />
          );
        })}
      </section>

      {/* 플로팅 버튼 */}
      <div className="floating-buttons">
        <button
          className="floating-btn"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart size={22} />
        </button>

        <button
          className="floating-btn"
          onClick={() => navigate("/orders")}
        >
          <Package size={22} />
        </button>

        <button
          className="floating-btn"
          onClick={() => navigate("/alerts")}
        >
          <Bell size={22} />
        </button>

        <button
          className="floating-btn logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------ PRODUCT CARD ------------------------ */
function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onViewDetail,
  viewMode,
}) {
  return (
    <div className={`market-card ${viewMode}`}>
      <div className="market-card__image">
        <img
          src={product.imageUrl}
          alt={product.name}
        />
      </div>

      <div className="market-card__body">
        <h3>{product.farmName}</h3>
        <p className="market-card__type">
          {product.systemType}
        </p>

        {product.stats && (
          <div className="market-card__stats">
            <div>
              <span>식물</span>
              <p>{product.plant}</p>
            </div>
            <div>
              <span>단계</span>
              <p>{product.stage}</p>
            </div>
            <div>
              <span>재배일</span>
              <p>{product.days}일</p>
            </div>
          </div>
        )}

        <div className="market-card__footer">
          <div className="market-card__price">
            {product.price.toLocaleString()}원
            <small>{product.unit}</small>
          </div>

          <button
            className="btn-main"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={16} /> 담기
          </button>
        </div>

        <div
          className="timelapse-btn"
          onClick={() => onViewDetail(product)}
        >
          <Info size={16} /> 상세보기
        </div>

        {/* ⭐ 변경된 바로 주문 버튼 */}
        <button
          className="timelapse-btn"
          onClick={() => onBuyNow(product)}
        >
          <ShoppingCart size={16} /> 바로 주문
        </button>
      </div>
    </div>
  );
}

/* ------------------------ DEVICE CARD ------------------------ */
function DeviceCard({
  product,
  onAddToCart,
  onViewDetail,
  onBuyNow,
  viewMode,
}) {
  return (
    <div
      className={`market-card device-card ${viewMode}`}
    >
      <div className="market-card__image">
        <img
          src={product.imageUrl}
          alt={product.name}
        />
        <span className="device-badge">
          <Cpu size={14} /> 기기
        </span>
      </div>

      <div className="market-card__body">
        <h3>{product.name}</h3>
        <p className="market-card__type">
          {product.farmName}
        </p>

        <p className="device-desc">
          {product.description}
        </p>

        {product.specs && (
          <ul className="device-specs">
            {product.specs.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}

        <div className="market-card__footer">
          <div className="market-card__price">
            {product.price.toLocaleString()}원
            <small>{product.unit}</small>
          </div>

          <button
            className="btn-main"
            onClick={() => onAddToCart(product)}
          >
            담기
          </button>
        </div>

        <div
          className="timelapse-btn"
          onClick={() => onViewDetail(product)}
        >
          <Info size={16} /> 상세보기
        </div>

        <button
          className="timelapse-btn"
          onClick={() => onBuyNow(product)}
        >
          <ShoppingCart size={16} /> 바로 주문
        </button>
      </div>
    </div>
  );
}

/* ------------------------ SERVICE CARD ------------------------ */
function ServiceCard({
  product,
  onAddToCart,
  viewMode,
}) {
  return (
    <div
      className={`market-card service-card ${viewMode}`}
    >
      <div className="market-card__body add-card">
        <div className="add-card__icon">
          <PlusCircle size={40} />
        </div>

        <h3>{product.name}</h3>
        <p className="market-card__type">
          {product.description}
        </p>

        <div className="market-card__price">
          {product.price.toLocaleString()}원
          <small>{product.unit}</small>
        </div>

        <button
          className="btn-main"
          onClick={() => onAddToCart(product)}
        >
          구매하기
        </button>
      </div>
    </div>
  );
}
