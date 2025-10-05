import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // ✅ 이 부분 수정됨


function DashboardPage() {
  const [username, setUsername] = useState("");
  const [riotAccount, setRiotAccount] = useState(null);
  const navigate = useNavigate();

  // ✅ 로그인 확인 + 유저 이메일 불러오기
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    setUsername(user.email?.split("@")[0] || "사용자");
  }, [navigate]);

  // ✅ Firestore에서 Riot 계정 불러오기
  useEffect(() => {
    const fetchRiotAccount = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setRiotAccount(userDoc.data());
    };

    fetchRiotAccount();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>환영합니다, {username}님 👋</h1>

      {riotAccount ? (
        <>
          <p style={styles.subtitle}>
            현재 등록된 라이엇 계정: <b>{riotAccount.summonerName}#{riotAccount.tagLine}</b>
          </p>

          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => navigate("/team-dashboard")}>
              팀 대시보드로 가기
            </button>
            <button style={styles.editButton} onClick={() => navigate("/riot-register")}>
              라이엇 계정 수정하기
            </button>
            <button style={styles.logoutButton} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={styles.subtitle}>아직 라이엇 계정이 등록되지 않았습니다.</p>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => navigate("/riot-register")}>
              🔹 라이엇 계정 등록하기
            </button>
            <button style={styles.logoutButton} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#00bfff",
  },
  subtitle: {
    marginTop: "10px",
    color: "#ccc",
  },
  buttonContainer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "15px",
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "8px",
  },
  editButton: {
    padding: "10px 20px",
    fontSize: "15px",
    backgroundColor: "#ffc107",
    border: "none",
    color: "black",
    cursor: "pointer",
    borderRadius: "8px",
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: "15px",
    backgroundColor: "#ff4747",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "8px",
  },
};

export default DashboardPage;
