import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from "../../slice/userSlice";
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import api from "../../api/api";
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const seletedImage = useSelector((state)=>state.gallery.seletedImage.image)
  const seletedtext = useSelector((state)=>state.gallery.seletedImage.text)


console.log('seletedImage'+JSON.stringify(seletedImage))
  const handleLogout= () =>{
    dispatch(logout());
    localStorage.removeItem("accessToken"); // 액세스 토큰 삭제
    localStorage.removeItem("refreshToken"); // 리프레시 토큰 삭제
    navigate("/");
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    console.log('values:', JSON.stringify(values));
  
    // 이미지와 텍스트 데이터를 formData에 추가
    formData.append('image', values.image);
    formData.append('text', values.text);
  
    try {
      // axios를 사용한 POST 요청
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // axios는 자동으로 처리하지만, 명시적으로 설정할 수도 있음
        },
      });
  
      // 서버 응답 처리
      if (response.status === 200) {
        alert('업로드 성공!');
        navigate('/gallery')
      } else {
        alert('업로드 실패!');
      }
    } catch (error) {
      alert('오류가 발생했습니다!');
      console.error(error);
    }
  
    setSubmitting(false);
  };

  

  const handleGetDate =async () =>{
    const response = await api.get('http://localhost:4000/get-date');

    if (response.status === 200) {
      alert(response.data.date)
    }
  }

  return (
    <div style={styles.container}>
    {/* 로그아웃 버튼을 화면의 오른쪽 상단에 배치 */}
    <button
      onClick={handleLogout}
      style={styles.logoutButton}
      onMouseEnter={(e) => (e.target.style.backgroundColor = '#e84e31')} // 호버 효과
      onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff6347')} // 기본 색으로 돌아오기
    >
      로그아웃
    </button>
    
    <Formik
      initialValues={{ text: seletedtext, image: null }}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="text">텍스트</label>
            <Field
              type="text"
              name="text"
              placeholder="텍스트를 입력하세요"
              style={styles.input}
            />
            <ErrorMessage name="text" component="div" style={styles.error} />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="image">이미지 업로드</label>
            {seletedImage && <img src={`http://localhost:4000/images/${seletedImage}`} alt="Selected" style={{ width: 100 }} />}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(event) => {
                setFieldValue('image', event.currentTarget.files[0]);
              }}
              style={styles.fileInput}
            />
            <ErrorMessage name="image" component="div" style={styles.error} />
          </div>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? '업로드 중...' : '업로드'}
          </button>
        </Form>
      )}
    </Formik>

    <button
      onClick={() => navigate("/gallery")}
      style={styles.navigateButton}
      onMouseEnter={(e) => (e.target.style.backgroundColor = '#009acd')} // 호버 효과
      onMouseLeave={(e) => (e.target.style.backgroundColor = '#00bfff')} // 기본 색으로 돌아오기
    >
      게시판 바로가기
    </button>
  </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  
  },
  button: {
    backgroundColor: '#FFA500', // 주황색 버튼
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    margin: '10px 0', // 상하 여백
  },
  buttonHover: {
    backgroundColor: '#ff7f50', // 호버 시 색상 변경
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // 각 항목 사이에 간격 추가
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#FFA500', // 포커스 시 주황색 테두리
  },
  fileInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#ff6347', // 토마토 색상
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#e84e31', // 로그아웃 버튼 호버 효과
  },
  navigateButton: {
    backgroundColor: '#00bfff', // 하늘색
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
  },
  navigateButtonHover: {
    backgroundColor: '#009acd', // 게시판 바로가기 버튼 호버 효과
  },
};

export default App;
