import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, `${email}@fake.com`, password);
      navigate("/dashboard");
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>회원가입</h2>
      <form onSubmit={handleRegister} style={styles.form}>
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
          회원가입
        </button>
      </form>
      <p style={styles.switchText}>
        이미 계정이 있으신가요?{" "}
        <Link to="/login" style={styles.link}>
          로그인
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
    backgroundColor: "#28a745",
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

export default RegisterPage;
