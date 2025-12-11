// src/components/dashboard/PresetItem.jsx
import "./PresetInfo.css"; // 스타일은 PresetInfo.css에서 같이 관리

export default function PresetItem({ icon, label, value }) {
  return (
    <div className="preset-item">
      <div className="preset-item-main">
        <div className="preset-icon">{icon}</div>

        <div className="preset-texts">
          <span className="preset-label">{label}</span>
          <span className="preset-value">{value}</span>
        </div>
      </div>
    </div>
  );
}
