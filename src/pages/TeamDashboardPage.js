import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { refreshTeamData } from "../services/teamDataService";

function TeamDashboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserSummoner, setCurrentUserSummoner] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false); // ✅ 유저 데이터 로딩 상태

  // ✅ 로그인 유저 감지 (새로고침 시에도 유지)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setCurrentUserSummoner(userDoc.data().summonerName);
          }
        } catch (err) {
          console.error("현재 유저 불러오기 실패:", err);
        }
      }
      setUserLoaded(true); // ✅ 유저 정보 로드 완료
    });

    return () => unsubscribe();
  }, []);

  // ✅ Firestore teamData 불러오기
  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const teamSnapshot = await getDocs(collection(db, "teamData"));
      const teamList = teamSnapshot.docs.map((doc) => doc.data());
      setPlayers(teamList);
    } catch (error) {
      console.error("teamData 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 첫 로드시 teamData 불러오기
  useEffect(() => {
    fetchTeamData();
  }, []);

  // ✅ 갱신하기 (Riot API 호출 + Firestore 업데이트)
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const updatedData = await refreshTeamData(usersSnapshot);
      setPlayers(updatedData);
      alert("팀 데이터 갱신 완료!");
    } catch (error) {
      console.error("갱신 실패:", error);
      alert("갱신 중 오류 발생!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 유저 데이터가 아직 로딩 중이면 로딩 표시
  if (!userLoaded) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>로딩 중...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 팀 대시보드</h1>

      <button style={styles.refreshButton} onClick={handleRefresh} disabled={loading}>
        {loading ? "갱신 중..." : "🔄 갱신하기"}
      </button>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>소환사명</th>
              <th>티어</th>
              <th>주 라인</th>
              <th>주 챔피언 1</th>
              <th>주 챔피언 2</th>
              <th>주 챔피언 3</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => {
              const isMe = currentUserSummoner && p.summonerName === currentUserSummoner;
              return (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: isMe ? "#1E90FF33" : "transparent",
                    fontWeight: isMe ? "bold" : "normal",
                    color: isMe ? "#00bfff" : "#f0f0f0",
                  }}
                >
                  <td>{isMe ? `${p.summonerName} ⭐ (나)` : p.summonerName}</td>
                  <td>{p.tier}</td>
                  <td>{p.mainLane}</td>
                  <td>{p.topChampions?.[0]}</td>
                  <td>{p.topChampions?.[1]}</td>
                  <td>{p.topChampions?.[2]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    color: "#f0f0f0",
  },
  title: {
    fontSize: "28px",
    color: "#00bfff",
    marginBottom: "30px",
  },
  refreshButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  table: {
    width: "90%",
    margin: "0 auto",
    borderCollapse: "collapse",
    backgroundColor: "#111",
  },
};

export default TeamDashboardPage;
