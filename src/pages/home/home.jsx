import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const navigate = useNavigate();

  const handleLogout= () =>{
    localStorage.removeItem("token");

    navigate("/");
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기

  //     if (!token) {
  //       navigate("/"); 
  //       return;
  //     }

  //     try {
  //       // axios로 요청 보내기
  //       const response = await axios.get("http://localhost:4000/protected", {
  //         headers: {
  //          // "Accept": "application/json", //axios는 안해두댐 자동
  //           "Authorization": `Bearer ${token}`, // Authorization 헤더에 토큰 포함
  //         },
  //       });

  //       // 응답이 성공적이면 데이터 처리
  //       setMessage(response.data.message);
  //     } catch (error) {
  //       alert("error: " + error.message);
  //       navigate("/"); 
  //     }
  //   };

  //   fetchData(); 
  // }, [navigate]);

  return (
    <div>
      <button onClick={handleLogout}>로그아웃</button>
      <h3>{localStorage.getItem("userId")}님 안녕하세요!</h3>
        <p>여기에서 저에 대해 소개하겠어요!! 또찌는 자요ㅋㅋ!</p>
    </div>
  );
}

export default App;

