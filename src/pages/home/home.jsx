import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from "../../redux/userSlice";
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user);

  const handleLogout= () =>{
    dispatch(logout());
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
      } else {
        alert('업로드 실패!');
      }
    } catch (error) {
      alert('오류가 발생했습니다!');
      console.error(error);
    }
  
    setSubmitting(false);
  };
  

  return (
    <div style={styles.container}>
      {/* 로그아웃 버튼을 화면의 오른쪽 상단에 배치 */}
      <button onClick={handleLogout} style={styles.button}>로그아웃</button>
      <Formik
        initialValues={{ text: '', image: null }}
        // validationSchema={validationSchema}
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
  
  // 폼 스타일
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },

  inputGroup: {
    marginBottom: '20px',
  },

  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '5px',
    boxSizing: 'border-box',
  },

  fileInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '5px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },

  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },

  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff', 
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    }
  }

export default App;
