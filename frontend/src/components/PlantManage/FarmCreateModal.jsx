import React, { useState } from "react";
import styles from "./FarmCreateModal.module.css";
import { RangeSlider } from "../RangeSlider.jsx";

// --- [Icons] Simple SVG Icons to replace Lucide ---
const Icons = {
  Close: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Sprout: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.4-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.9z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-3.3 3-5.5-3.3-1.1-5.3-.1-6.2 2.9z" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
    >
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  ChevronUp: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  ),
};

// --- 프리셋 생성 시 나오는 트랙바 초기 데이터 값 ---
const DEFAULT_ENV = {
  temperature: { min: 20, max: 25 },
  humidity: { min: 50, max: 70 },
  co2: { min: 400, max: 800 },
  soilMoisture: { min: 40, max: 60 },
  light: { min: 5000, max: 10000 },
};
// --- 기존에 저장되어 불러온 프리셋 정보
const MOCK_PRESETS = [
  {
    presetId: "1",
    plantType: "청상추",
    name: "김농부",
    presetName: "청상추 프리셋",
    stages: [
      {
        id: 101,
        name: "0",
        environment: {
          ...DEFAULT_ENV,
          temperature: { min: 18, max: 22 },
        },
      },
      {
        id: 102,
        name: "1",
        environment: {
          ...DEFAULT_ENV,
          temperature: { min: 20, max: 24 },
        },
      },
    ],
  },
  {
    presetId: "2",
    plantType: "설향 딸기",
    name: "박마트",
    presetName: "스마트팜 프리셋",
    stages: [
      {
        id: 201,
        name: "0",
        environment: {
          ...DEFAULT_ENV,
          temperature: { min: 15, max: 20 },
        },
      },
    ],
  },
];

// --- [Main Component] ---
export const FarmCreateModal = ({ onClose, onCreate }) => {
  const [farmName, setFarmName] = useState(""); // 입력한 팜 이름

  // 프리셋 관련 state
  const [selectedPreset, setSelectedPreset] = useState(null); // 기존 프리셋 선택
  const [isCreatingNew, setIsCreatingNew] = useState(false); // 새 프리셋 생성
  const [isOpen, setIsOpen] = useState(false); //프리셋 선택 list를 열었는지 여부

  const [newPlantName, setNewPlantName] = useState(""); //new 식물 종 설정
  const [newPresetName, setNewPresetName] = useState(""); //new 프리셋 설정

  //팜 생성 대표 이미지
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기용

  // 이미지 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 생성
    }
  };

  // 성장 단계 데이터(단계 별 센서 범위)
  const [stepList, setStepList] = useState([
    {
      id: Date.now(),
      name: "0", //몇 단계인지
      environment: JSON.parse(JSON.stringify(DEFAULT_ENV)), //센서 데이터 범위
    },
  ]);
  const [stepOpen, setStepOpen] = useState([stepList[0].id]); // 펼쳐진 단계 list 관리

  // 핸들러: 기존 프리셋 선택
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    // 해당 프리셋에 대한 단계 별 데이터로 값 설정
    setStepList(
      preset.stages.map((stage) => ({
        ...stage,
        environment: JSON.parse(JSON.stringify(stage.environment)),
      }))
    );
    setIsOpen(false); // 리스트 닫기
    setIsCreatingNew(false);
  };

  // 핸들러: 새 프리셋 생성
  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedPreset(null);

    // 초기화
    const newStage = {
      id: Date.now(),
      name: "0",
      environment: JSON.parse(JSON.stringify(DEFAULT_ENV)),
    };

    setStepList([newStage]); //초기화 데이터 적용
  };

  // 핸들러: 단계 추가
  const addGrowthStage = () => {
    const newStage = {
      id: Date.now(),
      name: `${stepList.length}`,
      environment: JSON.parse(JSON.stringify(DEFAULT_ENV)),
    };
    setStepList([...stepList, newStage]);
  };

  // 핸들러: 단계 삭제
  const removeGrowthStage = (id) => {
    if (stepList.length > 1) {
      setStepList(stepList.filter((stage) => stage.id !== id));
    }
  };

  // 핸들러: 아코디언 토글
  const toggleStage = (id) => {
    if (stepOpen.includes(id)) {
      setStepOpen(stepOpen.filter((sid) => sid !== id));
    } else {
      setStepOpen([...stepOpen, id]);
    }
  };

  // 핸들러: 환경변수 업데이트
  const updateEnvironment = (stageId, key, min, max) => {
    setStepList(
      stepList.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              environment: {
                ...stage.environment,
                [key]: { min, max },
              },
            }
          : stage
      )
    );
  };

  // 핸들러: 단계 이름 변경
  const updateStageName = (stageId, name) => {
    setStepList(
      stepList.map((stage) =>
        stage.id === stageId ? { ...stage, name } : stage
      )
    );
  };
  // 팜 생성 시 처리되는 메서드
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmName) return alert("팜 이름을 입력해주세요.");
    if (!selectedPreset && !isCreatingNew)
      return alert("프리셋을 선택해주세요.");

    const payload = {
      farmName,
      plantType: isCreatingNew ? newPlantName : selectedPreset.plantType,
      presetName: isCreatingNew ? newPresetName : selectedPreset.presetName,
      image: previewUrl ? previewUrl : "https://images.unsplash.com/photo-1708975477420-907fd5691ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwcGxhbnRzfGVufDF8fHx8MTc2NDA3NTk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      stages: stepList,
      stepId: stepList[0].name,
      isNewPreset: isCreatingNew, // 백엔드 처리 구분용
    };

    console.log("Submit Payload:", payload);
    onCreate(payload);
  };

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles["modal-header"]}>
          <div className={styles["header-left"]}>
            <Icons.Sprout />
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>새로운 팜 생성</h2>
          </div>
          <button className={styles["close-btn"]} onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* 바디 */}
          <div className={styles["modal-body"]}>
            {/* 기본 정보 */}
            <div className={styles["form-section"]}>
              <label className={styles["label"]}>기본 정보</label>
              <div>
                {/* 팜 이름 입력*/}
                <div style={{ marginTop: "20px" }}>
                  <label className={styles["label"]}>팜 이름</label>
                  <input
                    className={styles["input-field"]}
                    placeholder="예: 상추 재배 A동"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
                {/* 프리셋 선택 영역 */}
                <div
                  style={{
                    marginTop: "20px",
                    position: "relative",
                  }}
                >
                  {" "}
                  {/* relative: 리스트 위치 기준점 */}
                  <label className={styles["label"]}>
                    식물 종류 프리셋 선택
                  </label>
                  {/* 새로운 식물 만들기 (직접 입력) */}
                  {isCreatingNew ? (
                    <div className={styles["preset-selected-box"]}>
                      <input
                        className={styles["input-field"]}
                        placeholder="원하는 식물 종 입력"
                        value={newPlantName}
                        autoFocus
                        onChange={(e) => setNewPlantName(e.target.value)}
                      />
                      <input
                        className={styles["input-field"]}
                        placeholder="새 프리셋 이름 입력"
                        value={newPresetName}
                        autoFocus
                        onChange={(e) => setNewPresetName(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles["change-btn"]}
                        onClick={() => {
                          setIsCreatingNew(false);
                          setNewPlantName("");
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    /* 드롭다운 선택 모드 */
                    <>
                      {/* 초기 클릭 시 리스트 토글 */}
                      <div
                        className={styles["preset-selector-trigger"]}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        {selectedPreset ? (
                          /* 선택된 프리셋 정보 표시 */
                          <div className={styles["preset-item"]}>
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                              }}
                            >
                              {selectedPreset.presetName}
                            </div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "#94a3b8",
                              }}
                            >
                              작성자: {selectedPreset.name}
                            </div>
                          </div>
                        ) : (
                          /* 선택 전 플레이스홀더 */
                          <span
                            style={{
                              color: "#94a3b8",
                            }}
                          >
                            저장된 프리셋을 선택하세요
                          </span>
                        )}
                        {/* 화살표 아이콘 (열림/닫힘 표시) */}
                        <span style={{ color: "#94a3b8" }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* 2. 드롭다운 리스트 (isOpen일 때만 보임) */}
                      {isOpen && (
                        <div className={styles["preset-list"]}>
                          {MOCK_PRESETS.map((preset) => (
                            <div
                              key={preset.presetId}
                              className={styles["preset-item"]}
                              onClick={() => {
                                handleSelectPreset(preset); // 부모 상태 업데이트
                              }}
                              style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #f1f5f9",
                                cursor: "pointer",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                {preset.presetName}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#94a3b8",
                                }}
                              >
                                {`${preset.plantType} | ${preset.stages.length}단계`}
                              </div>
                            </div>
                          ))}

                          {/* 리스트 맨 아래 '새로 만들기' 버튼 */}
                          <button
                            type="button"
                            className={styles["create-new-btn"]}
                            onClick={() => {
                              handleCreateNew(); // 새로 만들기 모드로 진입
                              setIsOpen(false); // 리스트 닫기
                            }}
                          >
                            + 새로운 식물 종류 만들기
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 성장 단계 설정 (트랙바) */}
            {(selectedPreset || isCreatingNew) && (
              <div>
                <div>
                  <div className={styles["section-title"]}>
                    식물 사진 업로드
                  </div>
                  <div className={styles["modal-content"]}>
                    <input
                      type="file"
                      className={styles["hidden-input"]}
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {/* 이미지 출력 영역 */}
                    <div style={{ marginTop: "20px" }}>
                      {previewUrl ? (
                        <div>
                          <p>미리보기:</p>
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ width: "300px", opacity: 0.5 }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className={styles["stage-header-row"]}>
                  <div
                    className={styles["section-title"]}
                    style={{ margin: 0 }}
                  >
                    성장 단계 설정
                  </div>
                  <button
                    type="button"
                    className={styles["add-stage-btn"]}
                    onClick={addGrowthStage}
                  >
                    <Icons.Plus /> 단계 추가
                  </button>
                </div>

                {stepList.map((stage) => (
                  <div key={stage.id} className={styles["stage-card"]}>
                    <div
                      className={styles["stage-top"]}
                      onClick={() => toggleStage(stage.id)}
                    >
                      <div>
                        <input
                          className={styles["stage-name-edit"]}
                          value={stage.name}
                          type="text"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            updateStageName(stage.id, onlyNumbers);
                          }}
                        />
                        <span>단계</span>
                      </div>

                      <div
                        style={{
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {stepList.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGrowthStage(stage.id);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Icons.Trash />
                          </button>
                        )}
                        {stepOpen.includes(stage.id) ? (
                          <Icons.ChevronUp />
                        ) : (
                          <Icons.ChevronDown />
                        )}
                      </div>
                    </div>

                    {stepOpen.includes(stage.id) && (
                      <div className={styles["stage-controls"]}>
                        <RangeSlider
                          label="온도"
                          min={0}
                          max={50}
                          step={1}
                          unit="°C"
                          minValue={stage.environment.temperature.min}
                          maxValue={stage.environment.temperature.max}
                          onChange={(min, max) =>
                            updateEnvironment(stage.id, "temperature", min, max)
                          }
                        />

                        <RangeSlider
                          label="습도"
                          min={0}
                          max={100}
                          step={1}
                          unit="%"
                          minValue={stage.environment.humidity.min}
                          maxValue={stage.environment.humidity.max}
                          onChange={(min, max) =>
                            updateEnvironment(stage.id, "humidity", min, max)
                          }
                        />

                        <RangeSlider
                          label="CO2"
                          min={0}
                          max={2000}
                          step={50}
                          unit="ppm"
                          minValue={stage.environment.co2.min}
                          maxValue={stage.environment.co2.max}
                          onChange={(min, max) =>
                            updateEnvironment(stage.id, "co2", min, max)
                          }
                        />

                        <RangeSlider
                          label="토양수분"
                          min={0}
                          max={100}
                          step={1}
                          unit="%"
                          minValue={stage.environment.soilMoisture.min}
                          maxValue={stage.environment.soilMoisture.max}
                          onChange={(min, max) =>
                            updateEnvironment(
                              stage.id,
                              "soilMoisture",
                              min,
                              max
                            )
                          }
                        />

                        <RangeSlider
                          label="조도"
                          min={0}
                          max={20000}
                          step={500}
                          unit="Lux"
                          minValue={stage.environment.light.min}
                          maxValue={stage.environment.light.max}
                          onChange={(min, max) =>
                            updateEnvironment(stage.id, "light", min, max)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className={styles["modal-footer"]}>
            <button
              type="button"
              className={styles["btn-cancel"]}
              onClick={onClose}
            >
              취소
            </button>
            <button type="submit" className={styles["btn-submit"]}>
              타임랩스 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
