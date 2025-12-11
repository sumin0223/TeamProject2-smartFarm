import styles from "./EmptyFarmCard.module.css";

export function EmptyFarmCard({ onClick }) {
    return (
        <div className={styles["empty-farm-card"]} onClick={onClick}>
            <div className={styles["empty-farm-card-content"]}>
                <button className={styles["add-farm-button"]}>+</button>
                <p className={styles["empty-farm-title"]}>새로운 팜 추가</p>
                <p className={styles["empty-farm-subtitle"]}>
                    클릭하여 팜을 생성하세요
                </p>
            </div>
        </div>
    );
}
