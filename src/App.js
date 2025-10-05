import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RiotRegisterPage from "./pages/RiotRegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TeamDashboardPage from "./pages/TeamDashboardPage"; // ✅ 추가

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/riot-register" element={<RiotRegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/team-dashboard" element={<TeamDashboardPage />} /> {/* ✅ 추가 */}
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#f0f0f0",
    padding: "20px",
  },
};

export default App;
