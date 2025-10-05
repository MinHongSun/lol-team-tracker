import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RiotRegisterPage() {
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 이미 등록된 계정이 있으면 기본값으로 표시
  useEffect(() => {
    const loadExistingData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setSummonerName(data.summonerName || "");
          setTagLine(data.tagLine || "");
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    loadExistingData();
  }, [navigate]);

  // ✅ 라이엇 계정 등록 or 수정
  const handleRegister = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!summonerName || !tagLine) {
      alert("소환사명과 태그를 모두 입력해주세요!");
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        summonerName,
        tagLine,
        createdAt: new Date(),
      });

      alert("라이엇 계정이 성공적으로 등록되었습니다!");
      navigate("/dashboard");
    } catch (error) {
      console.error("등록 오류:", error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>라이엇 계정 등록 / 수정</h2>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="소환사명 (예: Hide on bush)"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="태그 (예: KR1)"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          style={styles.input}
        />
      </div>

      <button onClick={handleRegister} style={styles.button} disabled={loading}>
        {loading ? "등록 중..." : "등록하기"}
      </button>

      <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
        돌아가기
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    color: "#f0f0f0",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#00bfff",
  },
  inputBox: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    width: "280px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#222",
    color: "white",
  },
  button: {
    marginTop: "25px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  backButton: {
    marginTop: "15px",
    padding: "8px 18px",
    backgroundColor: "#555",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default RiotRegisterPage;
