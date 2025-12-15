export function TempIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2a3 3 0 00-3 3v8.5a4.5 4.5 0 103 0V5a3 3 0 00-3-3z"
        stroke="#4A5B37"
        strokeWidth="2"
      />
    </svg>
  );
}

export function HumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3C7 8 5 11 5 14a7 7 0 0014 0c0-3-2-6-7-11z" stroke="#4A5B37" strokeWidth="2" />
    </svg>
  );
}

export function LightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="#4A5B37" strokeWidth="2" />
      <path
        stroke="#4A5B37"
        strokeWidth="2"
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      />
    </svg>
  );
}

export function Co2Icon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4A5B37"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 구름 윤곽선 */}
      <path d="M5 16h14a4 4 0 0 0 0-8 5 5 0 0 0-9.5-2A4 4 0 0 0 5 10a4 4 0 0 0 0 6z" />
    </svg>
  );
}

export function SoilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 17c3-2 6-2 9-2s6 0 9 2" stroke="#4A5B37" strokeWidth="2" />
      <circle cx="12" cy="7" r="3" stroke="#4A5B37" strokeWidth="2" />
    </svg>
  );
}
