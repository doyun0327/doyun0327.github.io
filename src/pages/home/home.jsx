import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleLogout= () =>{
    localStorage.removeItem("token");

    navigate("/");
  }

  useEffect(() => {
    const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
    // if (!token) {
    //   navigate("/"); // 토큰이 없으면 로그인 페이지로 이동
    //   return;
    // }

    // 서버에 요청 보내기
    fetch("/protected", {
      method: "GET",
      headers: {
       "Accept": "application / json",
        "Authorization": `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함
      },
    })
      .then((response) => {
        alert(JSON.stringify(response));
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("인증 실패");
        }
      })
      .then((data) => {
        setMessage(data.message); // 서버에서 받은 메시지를 상태에 저장
      })
      .catch((error) => {
      alert('error'+error)
      //  navigate("/"); // 인증 실패 시 로그인 페이지로 리디렉션
      });
  }, [navigate]);


  return (
    <div>
      <button onClick={handleLogout}>로그아웃</button>
      <h1>{message ? message : "로딩 중..."}</h1>
        <p>여기에서 저에 대해 소개하겠어요!! 또찌는 자요ㅋㅋ!</p>
    </div>
  );
}

export default App;

