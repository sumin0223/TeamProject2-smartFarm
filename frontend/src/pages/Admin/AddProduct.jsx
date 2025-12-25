import { useState } from "react";
import { useProducts } from "../../../contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddProduct() {
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "crop",
    price: 0,
    unit: "",
    image: "",
    description: "",
    stats: {},
    specs: [],
    stock: 0,
  });

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.id) form.id = crypto.randomUUID();

    addProduct(form);
    navigate("/admin/products");
  };

  return (
    <div
      className="market-container"
      style={{ minWidth: "1200px" }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "30px",
          }}
        >
          상품 추가
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "18px" }}
        >
          <input
            className="market-input"
            placeholder="상품명"
            value={form.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
          />

          <select
            className="market-input"
            value={form.category}
            onChange={(e) =>
              update("category", e.target.value)
            }
          >
            <option value="crop">작물</option>
            <option value="device">기기</option>
            <option value="service">
              서비스
            </option>
          </select>

          <input
            className="market-input"
            type="number"
            placeholder="가격"
            value={form.price}
            onChange={(e) =>
              update(
                "price",
                Number(e.target.value)
              )
            }
          />

          <input
            className="market-input"
            placeholder="단위 (예: 1세트, 1개)"
            value={form.unit}
            onChange={(e) =>
              update("unit", e.target.value)
            }
          />

          <input
            className="market-input"
            placeholder="이미지 URL"
            value={form.image}
            onChange={(e) =>
              update("image", e.target.value)
            }
          />

          {/* Crop → stats */}
          {form.category === "crop" && (
            <textarea
              className="market-input"
              placeholder="stats 입력 (예: {'수확량':'높음','난이도':'쉬움'})"
              onChange={(e) =>
                update(
                  "stats",
                  JSON.parse(e.target.value)
                )
              }
            />
          )}

          {/* Device → specs */}
          {form.category === "device" && (
            <textarea
              className="market-input"
              placeholder="specs 입력 (줄바꿈으로 구분)"
              onChange={(e) =>
                update(
                  "specs",
                  e.target.value.split("\n")
                )
              }
            />
          )}

          {/* Service → description */}
          {form.category === "service" && (
            <textarea
              className="market-input"
              placeholder="서비스 설명"
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />
          )}

          <button
            type="submit"
            className="btn-main"
            style={{
              marginTop: "14px",
              width: "180px",
            }}
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}
