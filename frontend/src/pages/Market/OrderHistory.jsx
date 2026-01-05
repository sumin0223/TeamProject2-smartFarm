import { useEffect, useState } from "react";
import { useAuth } from "../../api/auth/AuthContext";
import { useOrders } from "../../api/market/OrderContext";
import { useReviews } from "../../api/market/ReviewContext";
import { useNavigate } from "react-router";
import { Button } from "../../components/market/ui/button";
import { Badge } from "../../components/market/ui/badge";


import { getOrders } from "../../api/order/orderApi"; // 주문 유저별 주문목록 API

import { Textarea } from "../../components/market/ui/textarea";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  Star,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import "./OrderHistory.css"; // ⬅ CSS 연결

const statusConfig = {
  pending: {
    label: "주문 완료",  //주문대기였음
    color: "status-pending",
    icon: Clock,
  },
  processing: {
    label: "상품 준비중",
    color: "status-processing",
    icon: Package,
  },
  shipping: {
    label: "배송중",
    color: "status-shipping",
    icon: Truck,
  },
  delivered: {
    label: "배송 완료",
    color: "status-delivered",
    icon: CheckCircle,
  },
  confirmed: {
    label: "주문 확정",
    color: "status-confirmed",
    icon: CheckCircle,
  },
  cancelled: {
    label: "주문 취소",
    color: "status-cancelled",
    icon: Clock,
  },
  refund_requested: {
    label: "환불 요청",
    color: "status-refund-requested",
    icon: RotateCcw,
  },
  refunded: {
    label: "환불 완료",
    color: "status-refunded",
    icon: RotateCcw,
  },
};

// function ReviewModal({
//   isOpen,
//   onClose,
//   productName,
//   onSubmit,
// }) {
//   const [rating, setRating] =
//     useState(5);
//   const [comment, setComment] =
//     useState("");

//   if (!isOpen) return null;

//   return (
//     <div
//       className="refund-modal-overlay"
//       onClick={onClose}
//       onKeyDown={(e) => {
//         if (e.key === "Escape") onClose();
//       }}
//       tabIndex={-1}
//     >
//       <div
//         className="refund-modal"
//         onClick={(e) =>
//           e.stopPropagation()
//         }
//       >
//         <h2 className="refund-modal-title">
//           리뷰 작성
//         </h2>

//         <div className="refund-modal-body">
//           <p className="refund-modal-label">
//             상품명
//           </p>
//           <p className="mb-3">
//             {productName}
//           </p>

//           <p className="refund-modal-label">
//             평점
//           </p>
//           <div className="flex gap-2 mb-4">
//             {[1, 2, 3, 4, 5].map(
//               (num) => (
//                 <button
//                   key={num}
//                   type="button"
//                   onClick={() =>
//                     setRating(num)
//                   }
//                   className={
//                     num <= rating
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }
//                 >
//                   <Star />
//                 </button>
//               )
//             )}
//           </div>

//           <p className="refund-modal-label">
//             리뷰 내용
//           </p>
//           <Textarea
//             placeholder="리뷰를 입력해주세요"
//             value={comment}
//             onChange={(e) =>
//               setComment(
//                 e.target.value
//               )
//             }
//           />

//           <div className="refund-modal-actions">
//             <Button
//               variant="outline"
//               onClick={onClose}
//             >
//               취소
//             </Button>

//             <Button
//               onClick={() => {
//                 onSubmit(
//                   rating,
//                   comment
//                 );
//                 setRating(5);
//                 setComment("");
//                 onClose();
//               }}
//             >
//               등록
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





function ReviewModal({
  isOpen,
  onClose,
  productName,
  onSubmit,
}) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (comment.trim().length < 10) {
      alert("리뷰는 최소 10자 이상 작성해주세요");
      return;
    }

    onSubmit(rating, comment);
    setRating(5);
    setHoveredRating(0);
    setComment("");
    onClose();
  };

  return (
    <div
      className="refund-modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      tabIndex={-1}
    >
      <div
        className="refund-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="refund-modal-title">
          리뷰 작성
        </h2>

        <div className="refund-modal-body space-y-4">
          {/* 상품명 */}
          <div>
            <p className="refund-modal-label">상품명</p>
            <p>{productName}</p>
          </div>

          {/* 별점 */}
          <div>
            <p className="refund-modal-label mb-2">
              별점
            </p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() =>
                    setHoveredRating(star)
                  }
                  onMouseLeave={() =>
                    setHoveredRating(0)
                  }
                  onClick={() =>
                    setRating(star)
                  }
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-8 ${
                      star <=
                      (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center mt-1">
              {rating}점
            </p>
          </div>

          {/* 리뷰 내용 */}
          <div>
            <p className="refund-modal-label mb-1">
              리뷰 내용 (최소 10자)
            </p>
            <Textarea
              placeholder="상품에 대한 솔직한 리뷰를 작성해주세요"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
            />
            <p className="text-xs text-gray-400 mt-1">
              {comment.length}자
            </p>
          </div>

          {/* 버튼 */}
          <div className="refund-modal-actions">
            <Button
              variant="outline"
              onClick={onClose}
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>
              리뷰 등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function OrderHistory() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);

  // const { orders, requestRefund, confirmOrder } =
  //   useOrders();

  const { canReview, addReview } = useReviews();
  const navigate = useNavigate();

  const [reviewModalOpen, setReviewModalOpen] =
    useState(false);
  const [refundModalOpen, setRefundModalOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState(null);
  const [
    selectedOrderForRefund,
    setSelectedOrderForRefund,
  ] = useState(null);
  const [refundReason, setRefundReason] =
    useState("");

  const handleReviewSubmit = (
    rating,
    comment
  ) => {
    if (!selectedProduct || !user) return;

    addReview({
      productId: selectedProduct.id,
      userId: user.id,
      userName: user.name,
      orderId: selectedProduct.orderId,
      rating,
      comment,
    });

    toast.success("리뷰가 등록되었습니다");
    setSelectedProduct(null);
  };

  const handleRefundRequest = () => {
    if (
      !selectedOrderForRefund ||
      !refundReason.trim()
    ) {
      toast.error("환불 사유를 입력해주세요");
      return;
    }

      // ✅ 주문 확정 이후 환불 방어
  const order = orders.find(
    (o) => o.id === selectedOrderForRefund
  );
  if (order?.status === "confirmed") {
    toast.error(
      "주문 확정 이후에는 환불이 불가합니다"
    );
    return;
  }

    requestRefund(
      selectedOrderForRefund,
      refundReason
    );
    toast.success("환불 요청이 접수되었습니다");
    setRefundModalOpen(false);
    setSelectedOrderForRefund(null);
    setRefundReason("");
  };

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      //console.log("Raw Orders:", data); // ← 데이터 확인용

      const mapped = data.map((order) => ({
        ...order,
        id: order.orderUid,
        productId: order.productId,

        totalPrice: order.totalPrice,
        status: order.status.toLowerCase(), // DELIVERED → delivered
        paymentStatus: order.paymentStatus?.toLowerCase(),
        createdAt: new Date(order.createdAt),
        estimatedDelivery: order.estimatedDelivery
          ? new Date(order.estimatedDelivery)
          : null,
      }));

      //console.log("Mapped Orders:", mapped); // ← 화면용 데이터 확인
      setOrders(mapped);
    } catch (e) {
      toast.error("주문 내역을 불러오지 못했습니다");
    }
  };

  fetchOrders();
}, []);


  return (
    <div className="order-history-page">

      {/* Header */}
      <header className="order-header">
        <div className="order-header-inner">
          <Button
            variant="ghost"
            className="order-back-btn"
            onClick={() => navigate("/market")}
          >

                        <ArrowLeft size={20} />
            뒤로가기
            {/* <ArrowLeft className="size-[20px] mr-2" />
            뒤로가기 */}
          </Button>

          <h1 className="order-header-title">
            주문내역
          </h1>

          {/* 전체 삭제 버튼 */}
          {orders.length > 0 && (
            <button
              className="clear-btn"
              onClick={() => {
                // 전체 삭제 로직 구현 필요
                toast.success(
                  "전체 삭제 기능은 아직 구현되지 않았습니다."
                );
              }}
            >
              <Trash2 size={16} />
              전체 삭제
            </button>
          )}
        </div>
      </header>

      {/* 주문별 내역 */}
      <div className="order-content">
        {orders.length === 0 ? (
          <div className="order-empty">
            <Package className="order-empty-icon" />
            <p className="order-empty-title">
              주문 내역이 없습니다
            </p>
            <p className="order-empty-desc">
              스마트팜 신선 작물을 주문해보세요
            </p>
            <Button
              className="order-empty-btn"
              onClick={() => navigate("/market")}
            >
              쇼핑하러 가기
            </Button>
          </div>
        ) : (

        <div className="order-list-wrapper">

          <div className="order-list">
            {orders.map((order) => {
              const status =
                statusConfig[order.status];
              const StatusIcon = status.icon;

              return (

                <div
                  key={order.id}
                  className="order-card"
                >
                  <div className="order-card-header">
                    <div className="order-card-header-left">
                      <h3 className="order-id-label">
                        주문번호: {order.id}
                      </h3>
                      <Badge
                        className={status.color}
                      >
                        <StatusIcon className="mr-1 size-[14px]" />
                        {status.label}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="order-track-btn"
                      onClick={() =>
                        navigate(
                          `/tracking/${order.id}`
                        )
                      }
                    >
                      배송 추적
                    </Button>
                    
                  </div>

                  <div className="order-item-grid">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="order-item"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-img"
                        />
                        <div className="order-item-info">
                          <p className="order-item-name">
                            {item.category ===
                            "device"
                              ? item.name
                              : item.category ===
                                "service"
                              ? "타임랩스"
                              : item.plant}
                          </p>
                          <p className="order-item-qty">
                            {item.quantity}개
                          </p>
                          <p className="order-item-price">
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString()}
                            원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="order-summary-left">
                      <p>
                        주문일시:{" "}
                        {order.createdAt.toLocaleString(
                          "ko-KR"
                        )}
                      </p>
                      {order.estimatedDelivery && (
                        <p>
                          도착 예정:{" "}
                          {order.estimatedDelivery.toLocaleDateString(
                            "ko-KR"
                          )}
                        </p>
                      )}
                    </div>

                    <div className="order-summary-right">
                      <p className="order-total-label">
                        총 결제금액
                      </p>
                      <p className="order-total-price">
                        {order.totalPrice.toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status ===
                    "delivered" && (
                    <div className="order-actions">
                      <Button
                        className="order-confirm-btn"
                          onClick={() => {
                            if (order.status === "confirmed") return;
                            confirmOrder(order.id);
                            toast.success(
                              "주문이 확정되었습니다"
                            );
                          }}

                      >
                        <CheckCircle className="mr-2 size-[16px]" />
                        주문 확정
                      </Button>

                      {order.items.map((item) => {
                        const canWriteReview =
                          user &&
                          canReview(
                            user.id,
                            item.id,
                            order.id
                          );

                        return canWriteReview ? (
                          <Button
                            key={item.id}
                            variant="outline"
                            className="order-review-btn"
                            onClick={() => {
                              setSelectedProduct({
                                id: item.id,
                                name:
                                  item.category ===
                                  "device"
                                    ? item.name
                                    : item.plant ||
                                      item.name,
                                orderId: order.id,
                              });
                              setReviewModalOpen(
                                true
                              );
                            }}
                          >
                            <Star className="mr-2 size-[16px]" />
                            {item.category ===
                            "device"
                              ? item.name
                              : item.plant}{" "}
                            리뷰 작성
                          </Button>
                        ) : null;
                      })}

                        {/* {order.status !== "confirmed" &&
                          order.paymentStatus !== "refunded" &&
                          !order.refundReason && ( */}
                            {order.status === "delivered" &&
                          order.paymentStatus !== "refunded" &&
                          !order.refundReason && (
                            <Button
                              variant="outline"
                              className="order-refund-btn"
                              onClick={() => {
                                setSelectedOrderForRefund(order.id);
                                setRefundModalOpen(true);
                              }}
                            >
                              <RotateCcw className="mr-2 size-[16px]" />
                              환불 요청
                            </Button>
                          )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
        )}

{/* Review Modal */}
{selectedProduct && (
  <ReviewModal
    isOpen={reviewModalOpen}
    onClose={() => {
      setReviewModalOpen(false);
      setSelectedProduct(null);
    }}
    productName={selectedProduct.name}
    onSubmit={handleReviewSubmit}
  />
)}



{/* Refund Modal (React Modal) */}
{refundModalOpen && (
  <div
    className="refund-modal-overlay"
    onClick={() => {
      setRefundModalOpen(false);
      setSelectedOrderForRefund(null);
      setRefundReason("");
    }}
    onKeyDown={(e) => {
      if (e.key === "Escape") {
        setRefundModalOpen(false);
        setSelectedOrderForRefund(null);
        setRefundReason("");
      }
    }}
    tabIndex={-1}   // ✅ 키보드 이벤트 받기용
  >
    <div
      className="refund-modal"
      onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭 방지
    >
      <h2 className="refund-modal-title">
        환불 요청
      </h2>

      <div className="refund-modal-body">
        <div className="refund-modal-alert">
          <p className="refund-modal-alert-title">
            ⚠️ 환불 안내
          </p>
          <p className="refund-modal-alert-desc">
            환불 요청 후 관리자 승인이 필요합니다.
            승인 후 3-5 영업일 내 환불이 완료됩니다.
          </p>
        </div>

        <div>
          <p className="refund-modal-label">
            환불 사유
          </p>
          <Textarea
            className="refund-modal-textarea"
            placeholder="환불 사유를 상세히 입력해주세요"
            value={refundReason}
            onChange={(e) =>
              setRefundReason(e.target.value)
            }
          />
        </div>

        <div className="refund-modal-actions">
          <Button
            variant="outline"
            onClick={() => {
              setRefundModalOpen(false);
              setSelectedOrderForRefund(null);
              setRefundReason("");
            }}
          >
            취소
          </Button>

          <Button onClick={handleRefundRequest}>
            환불 요청
          </Button>
        </div>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
