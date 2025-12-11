import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./MyPageView.module.css";

function MyPageView() {
  const navigate = useNavigate();

  const [userData] = useState({
    loginId: "sayjoy97",
    name: "장세종",
    userAddr: "경남 통영시",
    email: "sayjoy97@gmail.com",
    phoneNumber: "010-8661-6470",
    novaSerialNumber: ["NOVA-2000", "NOVA-2001"],
  });

  return (
    <div className={styles.mypageCard}>
      <h1 className={styles.mypageTitle}>마이페이지</h1>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>아이디</div>
        <div className={styles.infoValue}>{userData.loginId}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>이름</div>
        <div className={styles.infoValue}>{userData.name}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>주소</div>
        <div className={styles.infoValue}>{userData.userAddr}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>이메일</div>
        <div className={styles.infoValue}>{userData.email}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>전화번호</div>
        <div className={styles.infoValue}>{userData.phoneNumber}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>NOVA 시리얼 번호</div>
        <div className={styles.serialList}>
          {userData.novaSerialNumber.map((s, i) => (
            <div key={i} className={styles.serialItemView}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttonArea}>
        <button className={styles.editBtn} onClick={() => navigate("/mypage/edit")}>
          정보 수정하기
        </button>
      </div>
    </div>
  );
}

export default MyPageView;
