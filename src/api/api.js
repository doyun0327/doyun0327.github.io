import axios from "axios";
import {
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "../utils/auth";
//Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터 - AccessToken 만료 체크 후, 토큰 갱신 로직 추가

api.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken(); // 현재 저장된 accessToken 가져오기
    // 토큰이 있고 만료되지 않았다면 그대로 사용
    if (accessToken && !isAccessTokenExpired(accessToken)) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("토큰만료안됨");
      return config;
    }

    // 토큰이 만료되었으면, 갱신하기
    if (accessToken && isAccessTokenExpired(accessToken)) {
      console.log("토큰만료된디");
      try {
        accessToken = await refreshAccessToken(); // refreshToken을 사용하여 accessToken을 갱신
        config.headers["Authorization"] = `Bearer ${accessToken}`; // 갱신된 토큰을 헤더에 추가
        console.log("토큰재인증완료" + accessToken);
        return config;
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        alert("토큰갱신실패"); // 갱신 실패시 로그인 페이지로 리디렉션하거나 에러처리
        window.location.href = "/";

        return Promise.reject(error);
      }
    }

    // 만약 accessToken이 없다면 그냥 요청을 보낸다.
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 오류 발생 시 토큰 갱신 및 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("응답인터셉터 들어옴;;");
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // 원래 요청을 새로운 Access Token으로 재시도
      } catch (err) {
        console.error("Access token refresh failed:", err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
