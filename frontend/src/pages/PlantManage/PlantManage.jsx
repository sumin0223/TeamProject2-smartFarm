import { useState } from "react";
import "./PlantManage.css";
import PlantModal from "./PlantModal";
import farmFullData from "../../api/mockDatas/farmFullData";
import { useAuth } from "../../api/auth/AuthContext";
import { FarmGrid } from "../../components/PlantManage/FarmGrid";
import { FarmCreateModal } from "../../components/PlantManage/FarmCreateModal";
import TimeLapseModal from "../../components/TimeLapse/TimeLapseModal";
import { TimeCreateModal } from "../../components/TimeLapse/TimeCreateModal";

// 예시 데이터
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
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isFarmCreateOpen, setIsFarmCreateOpen] = useState(false);
  const [isTimeLapseCreateOpen, setIsTimeLapseCreateOpen] = useState(false);
  const [timeLapseDetail, setTimeLapseDetail] = useState(null);
  const [farms, setFarms] = useState(initialFarms);

  const [newFarm, setNewFarm] = useState(null);

  // 🔥 로그인 정보 가져오기
  const { user } = useAuth();

  // 로그인 안 된 경우 → 안내 UI만 보여줌 (기존 코드 영향 없음)
  if (!user) {
    return (
      <div className="need-login-wrap">
        <h1>내 식물 관리</h1>
        <div className="need-login-box">
          <h2>로그인이 필요합니다</h2>
          <p>내 식물 관리는 로그인한 사용자만 이용할 수 있어요.</p>
          <button className="login-go-btn" onClick={() => (window.location.href = "/login")}>
            로그인 하러 가기 →
          </button>
        </div>
      </div>
    );
  }
  // 팜 생성 → 타임랩스 생성 연결
  const controlNextStep = (farmData) => {
    setNewFarm(farmData);
    setIsFarmCreateOpen(false);
    setIsTimeLapseCreateOpen(true);
  };

  // 팜 생성 처리
  const handleCreateFarm = (farmData) => {
    const newFarmData = {
      slot: farms.length + 1,
      ...farmData,
    };
    setFarms([...farms, newFarmData]);
    setIsFarmCreateOpen(false);
  };

  return (
    <div className="plants-page">
      <h1>내 식물 관리</h1>

      <FarmGrid
        farms={farms}
        maxCards={4}
        onAddFarm={() => setIsFarmCreateOpen(true)}
        onSelectFarm={() => setSelectedFarm(farmFullData)}
        onTimeLapse={setTimeLapseDetail} // ⬅ 여기만 수정!!
      />
      {/* <div className="farm-grid">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className="farm-card"
            onClick={() => {
              if (farm.plant) {
                setSelectedFarm(farmFullData); // 🔥 farmFullData 전달
              } else {
                setIsAddModalOpen(true);
              }
            }}
          >
            {farm.plant ? (
              <>
                <img src={farm.img} alt={farm.plant} className="plant-img" />
                <h3>팜 #{farm.id}</h3>
                <p>식물: {farm.plant}</p>
                <p>상태: {farm.status}</p>
              </>
            ) : (
              <div className="empty-farm">
                <span className="plus">+</span>
                <p>클릭하여 팜을 생성하세요</p>
              </div>
            )}
          </div>
        ))}
      </div> */}

      {selectedFarm && <PlantModal data={selectedFarm} onClose={() => setSelectedFarm(null)} />}

      {isFarmCreateOpen && (
        <FarmCreateModal onClose={() => setIsFarmCreateOpen(false)} onCreate={controlNextStep} />
      )}

      {isTimeLapseCreateOpen && (
        <TimeCreateModal
          farm={newFarm}
          onClose={() => setIsTimeLapseCreateOpen(false)}
          onCreate={handleCreateFarm}
        />
      )}

      {timeLapseDetail && (
        <TimeLapseModal farm={timeLapseDetail} onClose={() => setTimeLapseDetail(null)} />
      )}
    </div>
  );
}

export default PlantManage;
