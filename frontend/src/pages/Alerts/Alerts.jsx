//Notification 복붙함 react-router말고 react-router-dom사용하니 문제없
//import { useNavigate } from "react-router";

import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../api/market/NotificationContext";
import {
  ArrowLeft,
  Bell,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  RotateCcw,
  Info,
} from "lucide-react";

import "./Alerts.css";

const notificationIcons = {
  order: Package,
  payment: CreditCard,
  shipping: Truck,
  delivery: CheckCircle,
  refund: RotateCcw,
  system: Info,
};

export default function Alerts() {
  const navigate = useNavigate();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  const handleNotificationClick = (notif) => {
    if (!notif.read) markAsRead(notif.id);
    if (notif.orderId)
      navigate(`/tracking/${notif.orderId}`);
  };

  return (
    <div className="alerts-container">
      {/* Header */}
      <header className="alerts-header">
        <div className="alerts-header-inner">
          <button
            className="back-btn"
            onClick={() => navigate("/market")}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>

          <h1 className="alerts-title">알림</h1>

          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount}개 읽지 않음
            </span>
          )}

          {unreadCount > 0 && (
            <button
              className="allread-btn"
              onClick={markAllAsRead}
            >
              모두 읽음 처리
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="alerts-content">
        {notifications.length === 0 ? (
          <div className="alerts-empty">
            <Bell className="empty-icon" />
            <p className="empty-title">
              알림이 없습니다
            </p>
            <p className="empty-sub">
              새로운 알림이 도착하면 여기에
              표시됩니다
            </p>

            <button
              className="shop-btn"
              onClick={() => navigate("/market")}
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div className="alerts-list">
            {notifications.map((notif) => {
              const Icon =
                notificationIcons[notif.type];

              return (
                <div
                  key={notif.id}
                  className={`alert-card ${
                    !notif.read
                      ? "alert-unread"
                      : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick(notif)
                  }
                >
                  <div className="alert-icon-box">
                    <Icon className="alert-icon" />
                  </div>

                  <div className="alert-body">
                    <div className="alert-head">
                      <div className="alert-title-box">
                        <h3>{notif.title}</h3>
                        {!notif.read && (
                          <div className="new-dot" />
                        )}
                      </div>
                      <p className="alert-date">
                        {notif.createdAt.toLocaleString(
                          "ko-KR",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    <p className="alert-message">
                      {notif.message}
                    </p>

                    {notif.orderId && (
                      <div className="order-id-badge">
                        주문번호: {notif.orderId}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
