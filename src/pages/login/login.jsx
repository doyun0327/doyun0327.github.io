// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

const Login = () => {
  //   const [id, setId] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [errorMessage, setErrorMessage] = useState("");
  //   const navigate = useNavigate();

  //   const handleLogin = async (event) => {
  //     event.preventDefault();
  //     setErrorMessage(""); // 오류 메시지 초기화
  //     try {
  //       const response = await axios.post("/api/login", { id, password });
  //       localStorage.setItem("token", response.data.token); // 토큰 저장
  //       navigate("/home"); // 로그인 성공 시 홈 페이지로 이동
  //     } catch (error) {
  //       setErrorMessage("로그인 실패: ID 또는 비밀번호를 확인해주세요.");
  //     }
  //   };
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  //const navigate = useNavigate();

  const handleLogin = async () => {
    // const response = await axios.get("http://localhost:3000/", {
    //   id,
    //   password,
    // });

    try {
      const response = await fetch("http://localhost:4000/login"); //cors,bodyparser 확인..
      //navigate("/home");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };
  return (
    <div style={styles.container}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label>ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디를 입력하세요"
            style={styles.input}
            id="id"
          ></input>
        </div>
        <div style={styles.inputGroup}>
          <label>PW</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={styles.input}
            id="password"
          ></input>
        </div>
        <button type="submit" style={styles.button}>
          로그인
        </button>
      </form>
    </div>
  );
};

// 간단한 스타일 객체
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f7f9fc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: "1rem",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
};

export default Login;
