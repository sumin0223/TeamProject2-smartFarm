import { useState } from "react";
import "./PlantManage.css";
import PlantModal from "./PlantModal";
import farmFullData from "./farmFullData";
import { FarmGrid } from "../../components/PlantManage/FarmGrid";
import { FarmCreateModal } from "../../components/PlantManage/FarmCreateModal";
import { TimeLapseModal } from "../../components/TimeLapse/TimeLapseModal";
import { TimeCreateModal } from "../../components/TimeLapse/TimeCreateModal";

// 예시 데이터 - 실제 데이터는 API로 받아올 예정
const initialFarms = [
  {
    farmId: 1,
    farmName: "상추 재배 A동",
    slot: 1,
    createdTime: "2025-11-20 10:00:00",
    updateTime: "2025-11-20 10:00:00",
    presetId: 101,
    image:
      "https://images.unsplash.com/photo-1629148462856-a42f09873b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwbGFudCUyMGZhcm18ZW58MXx8fHwxNzY0MTY3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    plantType: "청상추",
    presetName: "청상추 표준 프리셋",
    stepId: 5,
    growthStep: 2,
    periodDays: 45,
  },
  {
    farmId: 2,
    farmName: "토마토 재배 B동",
    slot: 2,
    createdTime: "2025-10-22 09:30:00",
    updateTime: "2025-12-05 14:20:00",
    presetId: 102,
    plantType: "방울토마토",
    image:
      "https://images.unsplash.com/photo-1708975477420-907fd5691ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwcGxhbnRzfGVufDF8fHx8MTc2NDA3NTk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    presetName: "방울토마토 고급 프리셋",
    stepId: 3,
    growthStep: 1,
    periodDays: 60,
  },
];

function PlantManage() {
  const [selectedFarm, setSelectedFarm] = useState(null); // 팜 상세 모달
  const [isFarmCreateOpen, setIsFarmCreateOpen] = useState(false); // 팜 생성 모달
  const [isTimeLapseCreateOpen, setIsTimeLapseCreateOpen] = useState(false); //타임랩스 생성 모달
  const [timeLapseDetail, setTimeLapseDetail] = useState(null); // 타임랩스 상세 모달
  const [farms, setFarms] = useState(initialFarms); // 팜 카드 json 데이터
  const [newFarm, setNewFarm] = useState(null);

  // 다음 단계로 진행 (팜 만들기 → 타임랩스 만들기)
  const controlNextStep = (farmData) => {
    setNewFarm(farmData);
    setIsFarmCreateOpen(false);
    setIsTimeLapseCreateOpen(true);
  };

  // 팜 생성 처리
  const handleCreateFarm = (farmData) => {
    const newFarm = {
      slot: farms.length + 1,
      ...farmData,
      image: "figma:asset/3b935539e1a32b33472fa13c4e9875a8c504995c.png",
    };
    setFarms([...farms, newFarm]);
    setIsFarmCreateOpen(false);
  };

  return (
    <div className="plants-page">
      <h1>내 식물 관리</h1>
      <FarmGrid
        farms={farms}
        maxCards={4}
        onAddFarm={() => {
          setIsFarmCreateOpen(true);
        }}
        onSelectFarm={() => {
          setSelectedFarm(farmFullData);
        }}
        onTimeLapse={(farm) => {
          setTimeLapseDetail(farm);
        }}
      />

      {/* 🌱 팜 상세 모달 */}
      {selectedFarm && <PlantModal data={selectedFarm} onClose={() => setSelectedFarm(null)} />}

      {/* 🌱 팜 생성 단계 */}
      {isFarmCreateOpen && (
        <FarmCreateModal onClose={() => setIsFarmCreateOpen(false)} onCreate={controlNextStep} />
      )}

      {/* 🌱 타임랩스 생성 단계 */}
      {isTimeLapseCreateOpen && (
        <TimeCreateModal
          farm={newFarm}
          onClose={() => setIsTimeLapseCreateOpen(false)}
          onCreate={handleCreateFarm}
        />
      )}

      {/* 🌱 타임랩스 상세 보기 */}
      {timeLapseDetail && (
        <TimeLapseModal farm={timeLapseDetail} onClose={() => setTimeLapseDetail(null)} />
      )}
    </div>
  );
}

export default PlantManage;
