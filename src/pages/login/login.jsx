import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import { setUser } from "../../slice/userSlice";
import { useDispatch } from 'react-redux';
import api from "../../api/api";
import { useEditGallery } from "../../hooks/useGallery";
// 유효성 검사 스키마
const validationSchema = Yup.object({
  id: Yup.string().required("아이디를 입력하세요"),
  password: Yup.string().required("비밀번호를 입력하세요"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editGallery = useEditGallery();


  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    const data = {
      id: values.id,
      password: values.password,
    };

    try {
      const response = await axios.post("http://localhost:4000/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.message === "Login successful") {
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        localStorage.setItem("refreshToken", refreshToken);
       
        const decodedToken = jwtDecode(accessToken);
        const userName = decodedToken.name;
        dispatch(setUser({ id: decodedToken.id, name: userName }));
        editGallery('')
        navigate("/home");
      } else {
        alert(response?.data?.message);
      }
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
      setFieldError("password", "로그인 실패, 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div style={styles.container}>
      <h2 style={styles.title}>로그인</h2>
      <Formik
        initialValues={{ id: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="id" style={styles.label}>ID</label>
              <Field
                type="text"
                name="id"
                placeholder="아이디를 입력하세요"
                style={styles.input}
              />
              <ErrorMessage name="id" component="div" style={styles.error} />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>PW</label>
              <Field
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                style={styles.input}
              />
              <ErrorMessage name="password" component="div" style={styles.error} />
            </div>

            <button type="submit" style={styles.button} disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// 스타일 객체
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f7f7f7", // 부드러운 베이지색 배경
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    color: "#34495e", // 짙은 회색 (헤더 텍스트)
    fontSize: "2rem",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px", // 폼 너비 설정
    backgroundColor: "#ffffff", // 흰색 배경
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    width: "100%",
    marginBottom: "15px",
  },
  label: {
    color: "#34495e", // 라벨 색 (어두운 회색)
    marginBottom: "8px",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #dcdcdc", // 연한 회색 테두리
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "#ecf0f1", // 입력창 배경색 (연한 회색)
    color: "#34495e", // 입력 글자색
    outline: "none",
    transition: "border 0.3s",
  },
  inputFocus: {
    borderColor: "#27ae60", // 입력창 포커스시 초록색 테두리
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#27ae60", // 초록색 버튼
    border: "none",
    borderRadius: "4px",
    fontSize: "1.1rem",
    color: "#ffffff", // 버튼 텍스트 색상
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#2ecc71", // 버튼 호버시 색상 변경
  },
  error: {
    color: "#e74c3c", // 에러 메시지 색상 (붉은색)
    fontSize: "0.9rem",
    marginTop: "5px",
  },
};
export default Login;

