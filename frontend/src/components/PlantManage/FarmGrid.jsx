import { FarmCard } from "./FarmCard";
import { EmptyFarmCard } from "./EmptyFarmCard";
import styles from "./FarmGrid.module.css";

export function FarmGrid({
  farms,
  maxCards,
  onAddFarm,
  onSelectFarm,
  onTimeLapse,
}) {
  const emptySlots = maxCards - farms.length;

  return (
    <div className={styles["farm-grid-container"]}>
      <div className={styles["farm-grid"]}>
        {farms.map((farm) => (
          <FarmCard
            key={farm.slot}
            farm={farm}
            onClick={onSelectFarm}
            onTimeLapse={onTimeLapse} // farm을 전달하지 않음
          />
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <EmptyFarmCard key={farms.length + (index + 1)} onClick={onAddFarm} />
        ))}
      </div>
    </div>
  );
}
