// components/dashboard/icons/StageIcons.jsx
/**
 * 프리셋의 '단계'를 나타내는 아이콘
 */
export function StepIcon({ size = 18, color = "#50623A" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="12" rx="3" stroke={color} strokeWidth="2" />
      <path d="M8 10h8M8 14h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
