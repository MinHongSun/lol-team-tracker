import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, `${email}@fake.com`, password);
      navigate("/dashboard");
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>로그인</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          로그인
        </button>
      </form>
      <p style={styles.switchText}>
        계정이 없으신가요?{" "}
        <Link to="/register" style={styles.link}>
          회원가입
        </Link>
      </p>
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
  switchText: {
    marginTop: "15px",
    color: "#ccc",
  },
  link: {
    color: "#00bfff",
    textDecoration: "none",
  },
};

export default LoginPage;
