import React, { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RiotAccountPage() {
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        summonerName,
        tagLine,
        createdAt: new Date(),
      });

      alert("라이엇 계정이 등록되었습니다!");
      navigate("/dashboard");
    } catch (error) {
      console.error("등록 오류:", error);
      alert("계정 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Riot 계정 등록</h2>
      <form onSubmit={handleSave} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="소환사명"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="태그 (예: KR1)"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          required
        />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
  },
  title: {
    fontSize: "28px",
    color: "#00bfff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  input: {
    width: "250px",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "270px",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default RiotAccountPage;
