import React, {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import {
  createOrder,
  getOrderDetail,
} from "../../api/order/orderApi";
import { useCart } from "../../api/market/CartContext"; 

import backendServer from "../../api/backendServer";
import { Button } from "../../components/market/ui/button";
import { Input } from "../../components/market/ui/input";
import { Label } from "../../components/market/ui/label";


import "./Checkout.css";

const Checkout = () => {
  const {
    cartItems,
    changeQuantity,
    removeItem,
    clearAll,
  } = useCart(); 
  const [order, setOrder] = useState(null);
  const [requestDto, setRequestDto] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [IMPReady, setIMPReady] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerTel: "",
    buyerAddress: "",
    buyerPostcode: "",
    buyerMessage: "",
  });

  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const totalQuantity = items.reduce(
  (sum, item) => sum + item.quantity,
  0
);


  // 초기 카트 상품 로딩
  useEffect(() => {
    setItems(cartItems);
    setTotalPrice(
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      )
    );
  }, [cartItems]);

  useEffect(() => {
    const script =
      document.createElement("script");
    script.src =
      "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.onload = () => setIMPReady(true);
    document.head.appendChild(script);
    return () =>
      document.head.removeChild(script);
  }, []);

  // 수량 변경
  const handleIncrease = (item) => {
    changeQuantity(item.cartItemId, item.quantity + 1);
    toast.success("수량이 증가했습니다.");
    const updated = items.map((it) =>
      it.productId === item.productId
        ? { ...it, quantity: it.quantity + 1 }
        : it
    );
    setItems(updated);
    recalcTotal(updated);
  };
  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      toast.error("최소 수량은 1개입니다.");
      return;
    }
    changeQuantity(item.cartItemId, item.quantity - 1);
    toast.success("수량이 감소했습니다.");
    const updated = items.map((it) =>
      it.productId === item.productId
        ? { ...it, quantity: it.quantity - 1 }
        : it
    );
    setItems(updated);
    recalcTotal(updated);
  };

  // 상품 제거
  const handleRemove = (item) => {
    removeItem(item.productId);
    toast.success("상품이 삭제되었습니다.");
    const updated = items.filter(
      (it) => it.productId !== item.productId
    );
    setItems(updated);
    recalcTotal(updated);
  };

  const recalcTotal = (itemList) => {
    setTotalPrice(
      itemList.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      )
    );
  };

  // 주문 생성, 결제 로직 그대로 사용
  const handleOrder = async () => {
    if (
      !formData.buyerName ||
      !formData.buyerTel ||
      !formData.buyerAddress
    ) {
      toast.error(
        "필수 정보를 모두 입력해주세요."
      );
      return;
    }
    setLoading(true);
    try {
      const data = await createOrder();
      if (!data || !data.orderUid) {
        toast.error("주문 생성 실패");
        return;
      }
      setOrder(data);

      const paymentInfo = await getOrderDetail(
        data.orderUid
      );
      setRequestDto(paymentInfo);
    } catch (err) {
      console.error(err);
      toast.error("주문 생성 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 모든 주문을 삭제
  const handleClearAllOrders = () => {
    clearAll();
  };

  const requestPay = () => {
    if (!requestDto || !IMPReady) {
      toast.error(
        "결제 준비가 아직 완료되지 않았습니다."
      );
      return;
    }
    const IMP = window.IMP;
    IMP.init("imp62232411");
    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: requestDto.orderUid,
        goods_name: items
          .map((i) => i.productName)
          .join(", "),

        // 결제 팝업창 에 표시될 상품이름
        name:
          items.length > 1
            ? `${items[0].productName} 외 ${items.length - 1}건`
            : items[0].productName,

        amount: totalPrice,
        buyer_email: formData.buyerEmail,
        buyer_name: formData.buyerName,
        buyer_tel: formData.buyerTel,
        buyer_addr: formData.buyerAddress,
        buyer_postcode: formData.buyerPostcode,
      },
      async function (rsp) {
        if (rsp.success) {
          try {
            await backendServer.post("/payment", {
              payment_uid: rsp.imp_uid,
              order_uid: rsp.merchant_uid,
            });

            toast.success("결제 완료!");

            navigate("/success-payment", {
              state: {
                orderSummary, // ✅ SuccessPayment에서 그대로 사용
              },
            });
          } catch (error) {
            console.error(error);
            toast.error("서버 결제 승인 중 오류 발생");
            navigate("/fail-payment");
          }
        } else {
          toast.error("결제 실패: " + rsp.error_msg);
          navigate("/fail-payment");
        }
      }

    );
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          buyerAddress: data.address,
        }));
      },
    }).open();
  };


    /* =========================
     페이지 렌더링
  ========================= */
  return (
    <div className="cart-page-container">

            {/* HEADER */}
      <header className="cart-header">
        <div className="cart-header-inner">
          <button
            className="cart-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>

          <h1 className="cart-title">
              주문결제
          </h1>

                    {/* 전체 취소 버튼 */}
          {cartItems.length > 0 && (
            <button
              className="clear-btn"
              onClick={handleClearAllOrders}
            >
              <Trash2 size={16} />
              전체 취소
            </button>
          )}
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout">
          {/* 주문 상품 리스트 */}
          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty-box">
                <p className="cart-empty-text">
                  주문할 상품이 없습니다.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  className="cart-card"
                  key={item.productId}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="cart-card-img"
                  />
                  <div className="cart-card-info">
                    <h3 className="cart-card-title">
                      {item.productName}
                    </h3>
                    <p className="cart-card-unit">
                      {item.price.toLocaleString()}
                      원
                    </p>
                    <div className="cart-qty-row">
                      <div className="cart-qty-box">
                        <button
                          onClick={() =>
                            handleDecrease(item)
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleIncrease(item)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="cart-card-price">
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() =>
                      handleRemove(item)
                    }
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 배송/결제 정보 */}
          <form
            className="checkout-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* 주문 요약 (주문 생성 전에도 표시) */}
<div className="checkout-card">
  <h2 className="checkout-card-title">
    주문 요약
  </h2>

  <div className="summary-price-box">
    <div className="summary-line">
      <span>총 상품 수량</span>
      <span>{totalQuantity}개</span>
    </div>

    <div className="summary-line">
      <span>총 상품 금액</span>
      <span>
        {totalPrice.toLocaleString()}원
      </span>
    </div>

    <div className="summary-line">
      <span>배송비</span>
      <span className="free">무료</span>
    </div>



    <div className="summary-total">
      <span>총 결제금액</span>
      <span>
        {totalPrice.toLocaleString()}원
      </span>
    </div>

                {!requestDto && (

                <Button
                  className="cart-order-btn"
                  onClick={handleOrder}
                  disabled={loading}
                >
                  {loading
                    ? "주문 처리중..."
                    : "주문 생성"}
                </Button>

            )}

            {requestDto && (

                <div className="summary-price-box">
                  <div className="summary-line">
                    <span>총 주문 금액</span>
                    <span>
                      {totalPrice.toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className="summary-line">
                    <span>배송비</span>

                    <span className="free">
                      무료
                    </span>
                  </div>
                  
                  <div className="summary-total">
                    <span>최종 결제금액</span>

                    <span>
                      {totalPrice.toLocaleString()}
                      원
                    </span>

                  </div>

                <Button
                  className="cart-order-btn"
                  onClick={requestPay}
                  disabled={!IMPReady || loading}
                >
                  {loading
                    ? "결제 중..."
                    : `${totalPrice.toLocaleString()}원 결제하기`}
                </Button>
              </div>
            )}
  </div>
</div>



            <div className="checkout-card">
              <h2 className="checkout-card-title">
                배송 정보
              </h2>
              <InputField
                label="받는 분"
                value={formData.buyerName}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    buyerName: v,
                  })
                }
              />
              <InputField
                label="연락처"
                value={formData.buyerTel}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    buyerTel: v,
                  })
                }
              />
              <div className="checkout-field">
                <Label className="checkout-label">
                  주소
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="checkout-input"
                    value={formData.buyerAddress}
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={handleAddressSearch}
                  >
                    주소찾기
                  </Button>
                </div>
              </div>
              <InputField
                label="상세 주소"
                value={formData.buyerPostcode}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    buyerPostcode: v,
                  })
                }
              />
              <InputField
                label="배송 메시지"
                value={formData.buyerMessage}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    buyerMessage: v,
                  })
                }
              />
            </div>


          </form>
        </div>
      </div>
    </div>
  );
};

function InputField({ label, value, onChange }) {
  return (
    <div className="checkout-field">
      <Label className="checkout-label">
        {label}
      </Label>
      <Input
        className="checkout-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default Checkout;
