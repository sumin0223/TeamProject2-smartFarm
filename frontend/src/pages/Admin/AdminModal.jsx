// Modal.jsx
import React from "react";
import "./AdminModel.css"; // 필요하면 스타일 분리

export default function Modal({
  open,
  onClose,
  title,
  children,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="modal-title">{title}</h2>
        )}
        <div className="modal-body">
          {children}
        </div>

        <button
          className="modal-close-btn"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
