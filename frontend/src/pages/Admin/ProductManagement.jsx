import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/auth/AuthContext";
import { useProducts } from "../../api/market/ProductContext";
import { Button } from "../../components/market/ui/button";
import { Input } from "../../components/market/ui/input";
import { Label } from "../../components/market/ui/label";
import { Badge } from "../../components/market/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import Modal from "./AdminModal";
import "./ProductManagement.css";

export default function ProductManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [isAddModal, setIsAddModal] =
    useState(false);
  const [isEditModal, setIsEditModal] =
    useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [newProduct, setNewProduct] = useState({
    category: "crop",
    name: "",
    farmName: "",
    systemType: "",
    plant: "",
    stage: "",
    days: 0,
    price: 0,
    unit: "",
    image: "",
    description: "",
    stock: 100,
  });

  // 상품 추가
  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.farmName ||
      !newProduct.price
    ) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    addProduct(newProduct);
    toast.success("상품이 추가되었습니다");

    setIsAddModal(false);
    setNewProduct({
      category: "crop",
      name: "",
      farmName: "",
      systemType: "",
      plant: "",
      stage: "",
      days: 0,
      price: 0,
      unit: "",
      image: "",
      description: "",
      stock: 100,
    });
  };

  // 상품 수정
  const handleEditProduct = () => {
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      price: editingProduct.price,
      unit: editingProduct.unit,
      stage: editingProduct.stage,
      days: editingProduct.days,
      stock: editingProduct.stock,
    });

    toast.success("상품이 수정되었습니다");
    setIsEditModal(false);
    setEditingProduct(null);
  };

  // 삭제
  const handleDeleteProduct = (id, name) => {
    if (
      window.confirm(
        `${name}을(를) 삭제하시겠습니까?`
      )
    ) {
      deleteProduct(id);
      toast.success("상품이 삭제되었습니다");
    }
  };

  return (
    <div className="pm-container">
      {/* Header */}
      <header className="pm-header">
        <div className="pm-header-inner">
          <div className="pm-header-left">
            <Button
              variant="ghost"
              className="pm-back-btn"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="size-[20px] mr-2" />
              대시보드
            </Button>

            <h1 className="pm-title">
              상품 관리
            </h1>
          </div>

          <div className="pm-header-right">
            <Button
              className="pm-add-btn"
              onClick={() => setIsAddModal(true)}
            >
              <Plus className="size-[20px] mr-2" />
              상품 추가
            </Button>

            <Button
              variant="ghost"
              className="pm-logout-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="size-[20px]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product List */}
      <div className="pm-wrapper">
        <div className="pm-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="pm-card"
            >
              <div className="pm-card-img-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="pm-card-img"
                />

                <Badge
                  className={`pm-badge ${
                    product.category === "crop"
                      ? "badge-crop"
                      : product.category ===
                        "device"
                      ? "badge-device"
                      : "badge-service"
                  }`}
                >
                  {product.category === "crop"
                    ? "작물"
                    : product.category ===
                      "device"
                    ? "기기"
                    : "서비스"}
                </Badge>
              </div>

              <div className="pm-card-body">
                <h3 className="pm-card-title">
                  {product.category === "device"
                    ? product.name
                    : product.farmName}
                </h3>

                <p className="pm-card-sub">
                  {product.category === "device"
                    ? product.farmName
                    : product.plant}
                </p>

                <div className="pm-price-row">
                  <div>
                    <p className="pm-price">
                      {product.price.toLocaleString()}
                      원
                    </p>
                    <p className="pm-unit">
                      {product.unit}
                    </p>
                  </div>

                  {product.stock !==
                    undefined && (
                    <Badge
                      className={`pm-stock ${
                        product.stock <= 3
                          ? "stock-low"
                          : product.stock <= 10
                          ? "stock-mid"
                          : "stock-high"
                      }`}
                    >
                      재고: {product.stock}
                    </Badge>
                  )}
                </div>

                <div className="pm-btn-row">
                  <Button
                    variant="outline"
                    className="pm-edit-btn"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsEditModal(true);
                    }}
                  >
                    <Edit className="size-[16px] mr-2" />
                    수정
                  </Button>

                  <Button
                    variant="outline"
                    className="pm-delete-btn"
                    onClick={() =>
                      handleDeleteProduct(
                        product.id,
                        product.name
                      )
                    }
                  >
                    <Trash2 className="size-[16px]" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====================== */}
      {/* Add Modal */}
      {/* ====================== */}
      <Modal
        open={isAddModal}
        onClose={() => setIsAddModal(false)}
        title="새 상품 추가"
      >
        <div className="pm-dialog-grid">
          <div>
            <Label>카테고리</Label>
            <select
              className="pm-select"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category: e.target.value,
                })
              }
            >
              <option value="crop">작물</option>
              <option value="device">기기</option>
              <option value="service">
                서비스
              </option>
            </select>
          </div>

          <div>
            <Label>상품명</Label>
            <Input
              className="pm-input"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>팜/시리즈명</Label>
            <Input
              className="pm-input"
              value={newProduct.farmName}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  farmName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>시스템 타입</Label>
            <Input
              className="pm-input"
              value={newProduct.systemType}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  systemType: e.target.value,
                })
              }
            />
          </div>

          {/* 작물 전용 */}
          {newProduct.category === "crop" && (
            <>
              <div>
                <Label>식물</Label>
                <Input
                  className="pm-input"
                  value={newProduct.plant}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      plant: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>단계</Label>
                <Input
                  className="pm-input"
                  value={newProduct.stage}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stage: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>재배일</Label>
                <Input
                  type="number"
                  className="pm-input"
                  value={newProduct.days}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      days: parseInt(
                        e.target.value
                      ),
                    })
                  }
                />
              </div>
            </>
          )}

          <div>
            <Label>가격</Label>
            <Input
              type="number"
              className="pm-input"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label>단위</Label>
            <Input
              className="pm-input"
              value={newProduct.unit}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  unit: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>이미지 URL</Label>
            <Input
              className="pm-input"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  image: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>설명</Label>
            <Input
              className="pm-input"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>재고</Label>
            <Input
              type="number"
              className="pm-input"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock:
                    parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <Button
            className="pm-submit-btn"
            onClick={handleAddProduct}
          >
            추가
          </Button>
        </div>
      </Modal>

      {/* ====================== */}
      {/* Edit Modal */}
      {/* ====================== */}
      <Modal
        open={isEditModal}
        onClose={() => setIsEditModal(false)}
        title="상품 수정"
      >
        {editingProduct && (
          <div className="pm-dialog-grid">
            <div>
              <Label>가격</Label>
              <Input
                type="number"
                className="pm-input"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseInt(
                      e.target.value
                    ),
                  })
                }
              />
            </div>

            <div>
              <Label>단위</Label>
              <Input
                className="pm-input"
                value={editingProduct.unit}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    unit: e.target.value,
                  })
                }
              />
            </div>

            {editingProduct.category ===
              "crop" && (
              <>
                <div>
                  <Label>단계</Label>
                  <Input
                    className="pm-input"
                    value={editingProduct.stage}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stage: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>재배일</Label>
                  <Input
                    type="number"
                    className="pm-input"
                    value={editingProduct.days}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        days: parseInt(
                          e.target.value
                        ),
                      })
                    }
                  />
                </div>
              </>
            )}

            <div>
              <Label>재고</Label>
              <Input
                type="number"
                className="pm-input"
                value={editingProduct.stock || 0}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock:
                      parseInt(e.target.value) ||
                      0,
                  })
                }
              />
            </div>

            <Button
              className="pm-submit-btn"
              onClick={handleEditProduct}
            >
              수정 완료
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
