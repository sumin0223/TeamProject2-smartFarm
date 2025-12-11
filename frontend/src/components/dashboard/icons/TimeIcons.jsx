// components/dashboard/icons/TimeIcons.jsx
/**
 * 유지기간(days)을 나타내는 아이콘
 */
export function TimeIcon({ size = 18, color = "#50623A" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
