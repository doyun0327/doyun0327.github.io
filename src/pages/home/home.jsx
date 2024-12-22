import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from "../../slice/userSlice";
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from "../../api/api";
import { getAccessToken } from "../../utils/auth";
import { CiClock2  } from "react-icons/ci";
import SuccessAlert from "../../common/successAlert";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const seletedImage = useSelector((state)=>state.gallery.seletedImage.image)
 // const seletedtext = useSelector((state)=>state.gallery.seletedImage.text)
  const [alertMessage, setAlertMessage] = useState('');


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
      const response = await api.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // axios는 자동으로 처리하지만, 명시적으로 설정할 수도 있음
        },
      });
  
      // 서버 응답 처리
      if (response.status === 200) {
        setAlertMessage('업로드가 완료되었습니다.');
          
              
          // 일정 시간 후 알림 메시지를 초기화
          setTimeout(() => {
            setAlertMessage('');
            navigate('/gallery')

          }, 1000);  // 3초 후 알림 메시지를 초기화
     
      } else {
        alert('업로드 실패!');
      }
    } catch (error) {
      alert('오류가 발생했습니다!');
      console.error(error);
    }
  
    setSubmitting(false);
  };

  

function getRemainingTime(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));

  const expTime = payload.exp * 1000; // exp는 초 단위, 밀리초로 변환
  const currentTime = Date.now();

  const remainingTime = expTime - currentTime; // 남은 시간 (밀리초 단위)

  // 남은 시간을 시, 분, 초로 변환
  if (remainingTime <= 0) {
    return '토큰 만료';
  }

  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return `${hours}시간 ${minutes}분 ${seconds}초`;
}

const accessToekn = getAccessToken();
const [tokenExpireTime,setTokenExpireTime] = useState('');
useEffect(()=>{
  if (accessToekn) {
    // 1초마다 남은 시간을 갱신하여 화면에 표시
    setInterval(() => {
      const remainingTime = getRemainingTime(accessToekn);
      setTokenExpireTime(remainingTime)
    }, 1000); // 1000ms = 1초마다 실행
  }
},[accessToekn])

return (
  <div style={styles.container}>

{alertMessage && <SuccessAlert message={alertMessage} />}


    <div style={styles.tokenExpireTimeContainer}>
    <CiClock2 size={20} />
      <div style={styles.tokenExpireTime}>  {tokenExpireTime}</div>
      <button
        onClick={handleLogout}
        style={styles.logoutButton}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#e84e31')} // 호버 효과
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff6347')} // 기본 색으로 돌아오기
      >
        로그아웃
      </button>
    </div>

    <Formik
      initialValues={{ text: '', image: null }}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="text" style={styles.inputLabel}>텍스트</label>
            <Field
              type="text"
              name="text"
              placeholder="텍스트를 입력하세요"
              style={styles.input}
            />
            <ErrorMessage name="text" component="div" style={styles.errorMessage} />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="image" style={styles.inputLabel}>이미지 업로드</label>
            {/* {seletedImage && <img src={`http://localhost:4000/images/${seletedImage}`} alt="Selected" style={styles.imagePreview} />} */}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(event) => {
                setFieldValue('image', event.currentTarget.files[0]);
              }}
              style={styles.fileInput}
            />
            <ErrorMessage name="image" component="div" style={styles.errorMessage} />
          </div>

          <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
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
  // 전체 컨테이너
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },

  // 토큰 만료 시간과 로그아웃 버튼을 일렬로 배치할 컨테이너
  tokenExpireTimeContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px', // 너비를 적당히 제한
    marginBottom: '20px',
    gap:'10px'
  },

  // 토큰 만료 시간 스타일
  tokenExpireTime: {
    fontSize: '14px',
    color: '#ddd',
  },

  // 로그아웃 버튼 스타일
  logoutButton: {
    backgroundColor: '#ff6347',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    borderRadius: '5px',
  },

  // 폼 스타일
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '300px',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },

  // 입력 그룹
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  // 레이블 스타일
  inputLabel: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#ccc',
  },

  // 입력 필드
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #555',
    borderRadius: '5px',
    backgroundColor: '#444',
    color: '#fff',
    marginBottom: '10px',
  },

  // 파일 입력 필드
  fileInput: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #555',
    borderRadius: '5px',
    backgroundColor: '#444',
    color: '#fff',
    marginBottom: '10px',
  },

  // 에러 메시지
  errorMessage: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },

  // 이미지 미리보기
  imagePreview: {
    width: '100px',
    margin: '10px 0',
  },

  // 업로드 버튼
  submitButton: {
    backgroundColor: '#ffc800',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },

  // 비활성화된 버튼 스타일
  submitButtonDisabled: {
    backgroundColor: '#777',
    cursor: 'not-allowed',
  },

  // 업로드 버튼 호버 효과
  submitButtonHover: {
    backgroundColor: '#e84e31',
  },

  // 바로가기 버튼
  navigateButton: {
    backgroundColor: '#00bfff',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop:'20px'
  },

  // 바로가기 버튼 호버 효과
  navigateButtonHover: {
    backgroundColor: '#009acd',
  },
};



export default App;
