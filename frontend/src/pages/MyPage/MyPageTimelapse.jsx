import React, {useState} from "react";
import styles from "./MyPageTimelapse.module.css";

function MyPageTimelapse() {
  const timelapseData = [
    {
      serial: "NOVA-2000",
      farms: [
        {
          farmName: "방울토마토 농장 1",
          timelapses: [
            {id: 1, title: "성장기록 1차", status: "DONE", size: "45MB"},
            {id: 2, title: "성장기록 2차", status: "PROGRESS", progress: 62},
            {id: 3, title: "성장기록 3차", status: "PENDING"},
          ],
        },
      ],
    },
    {
      serial: "NOVA-2001",
      farms: [
        {
          farmName: "허브 농장 1",
          timelapses: [],
        },
      ],
    },
  ];

  return (
    <div className={styles.timelapsePage}>
      <h1 className={styles.timelapseTitle}>타임랩스 관리</h1>

      {timelapseData.map((device) => (
        <div key={device.serial} className={styles.deviceBox}>
          <h2 className={styles.deviceTitle}>{device.serial}</h2>

          {device.farms.map((farm, i) => (
            <div key={i} className={styles.farmBox}>
              <h3 className={styles.farmTitle}>{farm.farmName}</h3>

              {farm.timelapses.length === 0 && (
                <div className={styles.noTimelapse}>타임랩스가 없습니다.</div>
              )}

              <div className={styles.timelapseList}>
                {farm.timelapses.map((tl) => (
                  <div
                    key={tl.id}
                    className={`${styles.timelapseCard} ${
                      styles["status-" + tl.status.toLowerCase()]
                    }`}
                  >
                    <h4 className={styles.tlTitle}>{tl.title}</h4>

                    {tl.status === "DONE" && (
                      <div className={styles.tlActions}>
                        <button className={styles.viewBtn}>보기</button>
                        <button className={styles.downloadBtn}>다운로드</button>
                        <div className={styles.tlSize}>용량: {tl.size}</div>
                      </div>
                    )}

                    {tl.status === "PROGRESS" && (
                      <div className={styles.progressBox}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{width: `${tl.progress}%`}}
                          ></div>
                        </div>
                        <div className={styles.progressText}>{tl.progress}% 생성 중...</div>
                      </div>
                    )}

                    {tl.status === "PENDING" && <div className={styles.pendingText}>제작 예정</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MyPageTimelapse;
