// Login.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
      id: id,
      password: password,
    };
  
    try {
      // axios로 로그인 요청 보내기
      const response = await axios.post("http://localhost:4000/login", data, {
        headers: {
          "Content-Type": "application/json", 
        }
      });
  
      if (response?.data?.message === "Login successful") {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/home");
      } else {
        alert(response?.data?.message)
      }
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
      alert("로그인 실패, 다시 시도해주세요.");
    }
  };


  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   const data = {
  //     id: id,
  //     password: password,
  //   };
  
  //   try {
  //     const response = await fetch("http://localhost:4000/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  
  //     // 응답이 정상적이지 않으면 에러 처리
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  
  //     // 응답을 JSON으로 파싱하고, 그 내용을 출력
  //     const responseData = await response.json();
  //     console.log("Response data:", responseData);
  
  //     // 응답 데이터에서 메시지를 받는 부분
  //   if (responseData.message === "Login successful") {
  //     localStorage.setItem("isLoggedIn", "true");
  //     navigate("/home");
  //   } else {
  //     console.log("로그인 실패:", responseData.message);
  //     alert(responseData.message); 
  //   }
  //   } catch (error) {
  //     alert("Error: " + error.message);
  //     console.error("Fetch error: ", error);
  //   }
  // };

  
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
