// src/components/dashboard/PresetInfo.jsx
import { useState } from "react";
import "./PresetInfo.css";

import { ArrowLeftIcon, ArrowRightIcon } from "./icons/NavIcons";
import { TempIcon, HumIcon, LightIcon, Co2Icon, SoilIcon } from "./icons/SensorIcons";
import PresetItem from "./PresetItem";

export default function PresetInfo({ presetSteps = [], activePresetStepId }) {
  if (!Array.isArray(presetSteps) || presetSteps.length === 0) {
    return <div className="preset-card empty">프리셋 정보를 불러오는 중...</div>;
  }
  const isActive = (step) => step.stepId === activePresetStepId;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const current = presetSteps[index];

  const totalSteps = presetSteps.length;

  const canPrev = index > 0;
  const canNext = index < totalSteps - 1;

  const next = () => {
    if (!canNext) return;
    setDirection("next");
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (!canPrev) return;
    setDirection("prev");
    setIndex((prev) => prev - 1);
  };

  const sensorList = [
    { icon: <TempIcon />, label: "Temperature", key: "temp", unit: "℃" },
    { icon: <HumIcon />, label: "Humidity", key: "humidity", unit: "%" },
    { icon: <SoilIcon />, label: "Soil Moisture", key: "soil_moisture", unit: "%" },
    { icon: <LightIcon />, label: "Light", key: "light", unit: "lx" },
    { icon: <Co2Icon />, label: "CO₂", key: "co2", unit: "ppm" },
  ];

  // 🔎 디버깅 (필요 없으면 나중에 삭제)
  console.log("current.stepId =", current.stepId);
  console.log("activePresetStepId =", activePresetStepId);

  return (
    <div className="preset-box">
      {/* ---------- HEADER ---------- */}
      <div className="preset-header">
        <button className={`nav-btn prev ${!canPrev ? "disabled" : ""}`} onClick={prev}>
          <ArrowLeftIcon />
        </button>

        <div className="preset-info">
          {/* 표시용 +1만 */}
          <h3>{`Step ${Number(current.growthStep) + 1}`}</h3>
          <span className="step-count">
            {Number(current.growthStep) + 1} / {totalSteps}
          </span>
          <span className="days">{current.periodDays} days</span>
        </div>

        <button className={`nav-btn next ${!canNext ? "disabled" : ""}`} onClick={next}>
          <ArrowRightIcon />
        </button>
      </div>

      {/* ---------- CONTENT ---------- */}
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

        {/* ✅ Active / Inactive 정확 */}
        <div className={`preset-status ${isActive(current) ? "active" : "inactive"}`}>
          {isActive(current) ? "● Active Step" : "○ Inactive Step"}
        </div>
      </div>
    </div>
  );
}
