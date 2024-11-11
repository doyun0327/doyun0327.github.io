import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/"); // 로그인되지 않은 경우 로그인 화면으로 리디렉션
    }
  }, [navigate]);

  return (
    <div style={{ backgroundColor: 'yellow' }}>
      <h1>안녕하세요!</h1>
        <p>여기에서 저에 대해 소개하겠어요!! 또찌는 자요ㅋㅋ!</p>
    </div>
  );
}

export default App;

