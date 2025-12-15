// src/components/dashboard/PresetInfo.jsx
import { useState } from "react";
import "./PresetInfo.css";

import { ArrowLeftIcon, ArrowRightIcon, DotsIcon } from "./icons/NavIcons";
import { TempIcon, HumIcon, LightIcon, Co2Icon, SoilIcon } from "./icons/SensorIcons";

import PresetItem from "./PresetItem";

export default function PresetInfo({ preset_step = [] }) {
  // -----------------------------
  // 0. 데이터 체크
  // -----------------------------
  if (!Array.isArray(preset_step) || preset_step.length === 0) {
    return <div className="preset-card empty">프리셋 정보를 불러오는 중...</div>;
  }

  // -----------------------------
  // 1. 현재 Step Index + 방향
  // -----------------------------
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next"); // "next" | "prev"

  const totalSteps = preset_step.length;
  const current = preset_step[index] || preset_step[0];

  // 루프 방지용 경계값
  const canPrev = index > 0;
  const canNext = index < totalSteps - 1;

  // -----------------------------
  // 2. 이전/다음 이동
  // -----------------------------
  const next = () => {
    if (!canNext) return;
    setDirection("next");
    setIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prev = () => {
    if (!canPrev) return;
    setDirection("prev");
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  // -----------------------------
  // 3. 단계명
  // -----------------------------
  const stageLabel = (step) => `Step ${step}`;

  // -----------------------------
  // 4. 센서 리스트 구성
  // -----------------------------
  const sensorList = [
    { icon: <TempIcon />, label: "Temperature", key: "temp", unit: "℃" },
    { icon: <HumIcon />, label: "Humidity", key: "humidity", unit: "%" },
    { icon: <SoilIcon />, label: "Soil Moisture", key: "soil_moisture", unit: "%" },
    { icon: <LightIcon />, label: "Light", key: "light", unit: "lx" },
    { icon: <Co2Icon />, label: "CO₂", key: "co2", unit: "ppm" },
  ];

  // -----------------------------
  // 5. UI 렌더링
  // -----------------------------
  return (
    <div className="preset-box">
      {/* -------------------- 헤더 -------------------- */}
      <div className="preset-header">
        <button
          className={`nav-btn prev ${!canPrev ? "disabled" : ""}`}
          onClick={prev}
          aria-label="Previous step"
        >
          <ArrowLeftIcon />
        </button>

        {/* 가운데 단계 정보 */}
        <div className="preset-info">
          <h3>{stageLabel(current.growth_step)}</h3>
          {/* 3 / 4  */}
          <span className="step-count">
            {current.growth_step} / {totalSteps}
          </span>
          {/* 15 days */}
          <span className="days">{current.period_days} days</span>
        </div>

        <button
          className={`nav-btn next ${!canNext ? "disabled" : ""}`}
          onClick={next}
          aria-label="Next step"
        >
          <ArrowRightIcon />
        </button>

        {/* <div className="header-right">
          <button className="more-btn">
            <DotsIcon />
          </button>
        </div> */}
      </div>

      {/* -------------------- 콘텐츠 -------------------- */}
      {/* direction 값으로 slide-next / slide-prev 클래스만 붙여서
          CSS에서 슬라이드 거리(예: 40px), 속도 조절하면 됨 */}
      {/* key={index} : index 바뀔 때마다 새로 mount → 애니메이션 매번 확실하게 실행 */}
      <div key={index} className={`preset-content slide-${direction}`}>
        <div className="preset-list">
          {sensorList.map((s) => {
            const range = current[s.key];
            if (!range) return null;

            return (
              <PresetItem
                key={s.key}
                icon={s.icon}
                label={s.label}
                value={`${range.min} – ${range.max} ${s.unit}`}
              />
            );
          })}
        </div>

        {/* Active 상태 */}
        <div className="preset-status active">● Active Step</div>
      </div>
    </div>
  );
}
