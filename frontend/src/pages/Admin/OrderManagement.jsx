import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/auth/AuthContext";
import { useOrders } from "../../api/market/OrderContext";
import { Button } from "../../components/market/ui/button";
import { Badge } from "../../components/market/ui/badge";
import { Input } from "../../components/market/ui/input";

import {
  ArrowLeft,
  LogOut,
  Package,
  Truck,
  CheckCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import "./OrderManagement.css";
import Modal from "./AdminModal";

/** Status Config */
const statusConfig = {
  pending: {
    label: "주문 대기",
    color: "status-pending",
    nextStatus: "processing",
    nextLabel: "상품 준비",
  },
  processing: {
    label: "상품 준비중",
    color: "status-processing",
    nextStatus: "shipping",
    nextLabel: "배송 시작",
  },
  shipping: {
    label: "배송중",
    color: "status-shipping",
    nextStatus: "delivered",
    nextLabel: "배송 완료",
  },
  delivered: {
    label: "배송 완료",
    color: "status-delivered",
    nextStatus: "confirmed",
    nextLabel: "주문 확정",
  },
  confirmed: {
    label: "주문 확정",
    color: "status-confirmed",
    nextStatus: null,
    nextLabel: "",
  },
  cancelled: {
    label: "주문 취소",
    color: "status-cancelled",
    nextStatus: null,
    nextLabel: "",
  },
  refund_requested: {
    label: "환불 요청",
    color: "status-refund-requested",
    nextStatus: null,
    nextLabel: "",
  },
  refunded: {
    label: "환불 완료",
    color: "status-refunded",
    nextStatus: null,
    nextLabel: "",
  },
};

export default function OrderManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    orders,
    updateOrderStatus,
    updateTrackingNumber,
    approveRefund,
  } = useOrders();

  const [
    trackingModalOpen,
    setTrackingModalOpen,
  ] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] =
    useState(false);

  const [selectedOrderId, setSelectedOrderId] =
    useState(null);
  const [trackingNumber, setTrackingNumber] =
    useState("");

  const [
    confirmTargetStatus,
    setConfirmTargetStatus,
  ] = useState("");

  /** 상태 변경 (배송중 → 배송완료 포함) */
  const handleStatusUpdate = (
    orderId,
    newStatus,
    orderNumber
  ) => {
  if (newStatus === "confirmed") {
    toast.error("관리자는 주문 확정을 할 수 없습니다");
    return;
  }



    // 배송 시작 -> 송장번호 입력 모달
    if (newStatus === "shipping") {
      setSelectedOrderId(orderId);
      setTrackingModalOpen(true);
      return;
    }

    // 배송 완료 -> 확인 모달
    if (newStatus === "delivered") {
      setSelectedOrderId(orderId);
      setConfirmTargetStatus("delivered");
      setConfirmModalOpen(true);
      return;
    }

    updateOrderStatus(orderId, newStatus);
    toast.success(
      `주문 ${orderNumber}의 상태가 업데이트되었습니다`
    );
  };

  /** 배송 중 → 배송 시작 (송장번호 입력 제출) */
  const handleTrackingSubmit = () => {
    if (
      !selectedOrderId ||
      !trackingNumber.trim()
    ) {
      toast.error("송장번호를 입력해주세요");
      return;
    }

    updateTrackingNumber(
      selectedOrderId,
      trackingNumber
    );
    updateOrderStatus(
      selectedOrderId,
      "shipping"
    );

    toast.success("배송이 시작되었습니다");

    setTrackingModalOpen(false);
    setSelectedOrderId(null);
    setTrackingNumber("");
  };

  /** 배송 완료 확인 모달 처리 */
  const handleConfirmSubmit = () => {
    updateOrderStatus(
      selectedOrderId,
      confirmTargetStatus
    );

    toast.success("배송이 완료되었습니다");

    setConfirmModalOpen(false);
    setSelectedOrderId(null);
  };

  /** 환불 승인 */
  const handleRefundApprove = (orderId) => {
    if (
      window.confirm("환불을 승인하시겠습니까?")
    ) {
      approveRefund(orderId);
      toast.success("환불이 승인되었습니다");
    }
  };

  /** 최신순 정렬 */
  const sortedOrders = [...orders].sort(
    (a, b) =>
      b.createdAt.getTime() -
      a.createdAt.getTime()
  );

  return (
    <div className="om-page">
      {/* Header */}
      <header className="om-header">
        <div className="om-header-inner">
          <div className="om-header-left">
            <Button
              className="om-header-btn"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="om-icon" />
              대시보드
            </Button>
            <h1 className="om-header-title">
              주문 관리
            </h1>
          </div>

          <Button
            className="om-header-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="om-icon" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="om-content">
        {sortedOrders.length === 0 ? (
          <div className="om-empty">
            <Package className="om-empty-icon" />
            <p className="om-empty-text">
              주문이 없습니다
            </p>
          </div>
        ) : (
          <div className="om-order-list">
            {sortedOrders.map((order) => {
              const status =
                statusConfig[order.status];

              return (
                <div
                  key={order.id}
                  className="om-card"
                >
                  {/* header */}
                  <div className="om-card-header">
                    <div className="om-card-header-left">
                      <h3 className="om-order-id">
                        주문번호: {order.id}
                      </h3>

                      <Badge
                        className={`om-badge om-status-animate ${status.color}`}
                      >
                        {status.label}
                      </Badge>

                      {order.paymentMethod && (
                        <Badge className="om-badge-payment">
                          {order.paymentMethod ===
                          "kakaopay"
                            ? "💬 카카오페이"
                            : "toss 토스페이"}
                        </Badge>
                      )}
                    </div>

                    <div className="om-card-header-right">
                      {order.status ===
                        "refund_requested" && (
                        <Button
                          className="om-btn-refund"
                          onClick={() =>
                            handleRefundApprove(
                              order.id
                            )
                          }
                        >
                          <RotateCcw className="om-btn-icon" />
                          환불 승인
                        </Button>
                      )}

{status.nextStatus && status.nextStatus !== "confirmed" && (
  <Button
    className="om-btn-progress"
    onClick={() =>
      handleStatusUpdate(
        order.id,
        status.nextStatus,
        order.id
      )
    }
  >
    {status.nextStatus === "processing" && (
      <Package className="om-btn-icon" />
    )}
    {status.nextStatus === "shipping" && (
      <Truck className="om-btn-icon" />
    )}
    {status.nextStatus === "delivered" && (
      <CheckCircle className="om-btn-icon" />
    )}

    {status.nextLabel}
  </Button>
)}

                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="om-timeline">
                    {[
                      "pending",
                      "processing",
                      "shipping",
                      "delivered",
                      "confirmed",
                    ].map((step) => (
                      <div
                        key={step}
                        className={`om-timeline-step ${
                          order.status === step ||
                          ([
                            "processing",
                            "shipping",
                            "delivered",
                            "confirmed",
                          ].includes(
                            order.status
                          ) &&
                            [
                              "pending",
                              "processing",
                              "shipping",
                              "delivered",
                              "confirmed",
                            ].indexOf(step) <=
                              [
                                "pending",
                                "processing",
                                "shipping",
                                "delivered",
                                "confirmed",
                              ].indexOf(
                                order.status
                              ))
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="dot" />
                        <p>
                          {
                            statusConfig[step]
                              .label
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* body */}
                  <div className="om-info-grid">
                    <div>
                      <h4 className="om-info-title">
                        주문 상품
                      </h4>
                      <div className="om-product-list">
                        {order.items.map(
                          (item) => (
                            <div
                              key={item.id}
                              className="om-product-item"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="om-product-image"
                              />
                              <div className="om-product-info">
                                <p className="om-product-name">
                                  {item.category ===
                                  "device"
                                    ? item.name
                                    : item.category ===
                                      "service"
                                    ? "타임랩스"
                                    : item.plant}
                                </p>
                                <p className="om-product-price">
                                  {item.quantity}
                                  개 ×{" "}
                                  {item.price.toLocaleString()}
                                  원
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="om-info-title">
                        배송 정보
                      </h4>
                      <div className="om-info-texts">
                        <p className="om-info-main">
                          {order.deliveryAddress}
                        </p>
                        <p className="om-info-sub">
                          연락처:{" "}
                          {order.phoneNumber}
                        </p>

                        {order.trackingNumber && (
                          <div className="om-tracking-box">
                            <p className="om-tracking-label">
                              송장번호
                            </p>
                            <code className="om-tracking-number">
                              {
                                order.trackingNumber
                              }
                            </code>
                          </div>
                        )}

                        <p className="om-info-date">
                          주문일시:{" "}
                          {order.createdAt.toLocaleString(
                            "ko-KR"
                          )}
                        </p>

                        {order.estimatedDelivery && (
                          <p className="om-info-date">
                            도착 예정:{" "}
                            {order.estimatedDelivery.toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        )}

                        {order.refundReason && (
                          <div className="om-refund-box">
                            <p className="om-refund-label">
                              환불 사유
                            </p>
                            <p className="om-refund-text">
                              {order.refundReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* footer */}
                  <div className="om-card-footer">
                    <div className="om-card-footer-left">
                      <Badge className="om-badge-payment">
                        결제:{" "}
                        {order.paymentStatus ===
                        "paid"
                          ? "완료"
                          : "대기"}
                      </Badge>
                    </div>

                    <div className="om-total-box">
                      <p className="om-total-label">
                        총 결제금액
                      </p>
                      <p className="om-total-price">
                        {order.totalPrice.toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 송장 입력 모달 (AdminModal 적용) */}
        <Modal
          open={trackingModalOpen}
          onClose={() => {
            setTrackingModalOpen(false);
            setSelectedOrderId(null);
            setTrackingNumber("");
          }}
          title="송장번호 등록"
        >
          <div className="om-modal-body">
            <p className="om-modal-info-desc">
              송장번호 등록 후 배송 상태가
              “배송중”으로 변경됩니다.
            </p>

            <p className="om-modal-label">
              송장번호
            </p>
            <Input
              className="om-modal-input"
              placeholder="예: 1234-5678-9012"
              value={trackingNumber}
              onChange={(e) =>
                setTrackingNumber(e.target.value)
              }
            />

            <div className="om-modal-buttons">
              <Button
                className="om-modal-cancel"
                onClick={() => {
                  setTrackingModalOpen(false);
                  setSelectedOrderId(null);
                  setTrackingNumber("");
                }}
              >
                취소
              </Button>

              <Button
                className="om-modal-submit"
                onClick={handleTrackingSubmit}
              >
                <FileText className="om-btn-icon" />
                등록 및 배송 시작
              </Button>
            </div>
          </div>
        </Modal>

        {/* 배송 완료 모달 */}
        <Modal
          open={confirmModalOpen}
          onClose={() => {
            setConfirmModalOpen(false);
            setSelectedOrderId(null);
          }}
          title="배송 완료 처리"
        >
          <div className="om-modal-body">
            <p className="om-modal-info-desc">
              해당 주문을 배송 완료
              처리하시겠습니까?
            </p>

            <div className="om-modal-buttons">
              <Button
                className="om-modal-cancel"
                onClick={() => {
                  setConfirmModalOpen(false);
                  setSelectedOrderId(null);
                }}
              >
                취소
              </Button>

              <Button
                className="om-modal-submit"
                onClick={handleConfirmSubmit}
              >
                완료 처리
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
