import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from "../../redux/userSlice";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user);

  const handleLogout= () =>{
    dispatch(logout());
    navigate("/");
  }

  return (
    <div style={styles.container}>
    {/* 로그아웃 버튼을 화면의 오른쪽 상단에 배치 */}
    <button onClick={handleLogout} style={styles.button}>로그아웃</button>

    {/* 헤더 스타일 */}
    <header style={styles.header}>
      <h3 style={styles.title}>{user?.name}님 안뇽하시옹</h3>
    </header>

    <p style={styles.text}>여기에서 저에 대해 소개하겠어요!! 또찌는 자요ㅋㅋ!</p>
  </div>
  );
}

const styles = {
  // 전체 화면을 위한 기본 스타일
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    backgroundColor: '#f7f7f7',
    paddingTop: '50px',  // 위쪽 여백을 조금 더 주어 버튼과 텍스트가 겹치지 않게 함
    position: 'relative', // button을 절대 위치로 배치하기 위해 필요
    boxSizing: 'border-box', // 패딩을 제외한 너비 계산
  },
  // 헤더 스타일
  header: {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  // 제목 스타일
  title: {
    fontSize: '1.5rem',
    margin: 0,
  },
  // 텍스트 소개 스타일
  text: {
    fontSize: '1rem',
    color: '#555',
    textAlign: 'center',
    marginBottom: '40px',
    lineHeight: '1.5',
    fontWeight: '300',
    wordWrap: 'break-word',
  },
  // 로그아웃 버튼 스타일 (오른쪽 상단에 위치)
  button: {
    position: 'absolute', // 화면의 오른쪽 상단에 고정
    top: '20px',
    right: '20px',
    backgroundColor: '#007bff', // 빨간색 배경
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#e53935',
  },
  buttonActive: {
    backgroundColor: '#c62828',
  },
  buttonFocus: {
    outline: 'none',
  },
};

export default App;

