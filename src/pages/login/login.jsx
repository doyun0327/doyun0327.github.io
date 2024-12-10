import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import { setUser } from "../../slice/userSlice";
import { useDispatch } from 'react-redux';
// 유효성 검사 스키마
const validationSchema = Yup.object({
  id: Yup.string().required("아이디를 입력하세요"),
  password: Yup.string().required("비밀번호를 입력하세요"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");


  const fetchData = async () => {
    const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기

    if (!token) {
      navigate("/"); 
      return;
    }

    try {
      // axios로 요청 보내기
      const response = await axios.get("http://localhost:4000/protected", {
        headers: {
         // "Accept": "application/json", //axios는 안해두댐 자동
          "Authorization": `Bearer ${token}`, // Authorization 헤더에 토큰 포함
        },
      });

      // 응답이 성공적이면 데이터 처리
      localStorage.setItem("token",response?.data?.result?.id);
    } catch (error) {
      alert("error: " + error.message);
      navigate("/"); 
    }
  };



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
        // localStorage.setItem("token",response?.data?.token);
        // const decodedToken = jwtDecode(response.data.token);
        // console.log('decodedToken:'+JSON.stringify(decodedToken))
        // const userName = decodedToken.name;
        // dispatch(setUser({ id: decodedToken.id, name: userName }));
        // navigate("/home");
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        // 리프레시 토큰을 세션 저장소에 저장 (예시, 보안상 서버에 저장 권장)
        localStorage.setItem("refreshToken", refreshToken);
       
        // 토큰을 통해 사용자 정보를 상태로 저장 (예시)
        const decodedToken = jwtDecode(accessToken);
        console.log('accesstoekn:'+JSON.stringify(decodedToken));
        console.log('accesstorefreshTokenekn:'+JSON.stringify(jwtDecode(refreshToken)))
        const userName = decodedToken.name;
        dispatch(setUser({ id: decodedToken.id, name: userName }));
  
        // 홈으로 리디렉션
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
      <h2>로그인</h2>
      <Formik
        initialValues={{ id: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="id">ID</label>
              <Field
                type="text"
                name="id"
                placeholder="아이디를 입력하세요"
                style={styles.input}
              />
              <ErrorMessage
                name="id"
                component="div"
                style={styles.error}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password">PW</label>
              <Field
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                style={styles.input}
              />
              <ErrorMessage
                name="password"
                component="div"
                style={styles.error}
              />
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
    marginTop: "5px",
  },
};

export default Login;

