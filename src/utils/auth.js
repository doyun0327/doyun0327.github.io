import { jwtDecode } from "jwt-decode";
import axios from "axios";

//AccessToken 가져오기
export const getAccessToken = () => localStorage.getItem("accessToken");

//RefreshToken 가져오기
export const getRefreshToken = () => localStorage.getItem("refreshToken");

//AccessToken 만료 여부 확인
export const isAccessTokenExpired = (token) => {
  if (!token) {
    return true; // 토큰이 없다면 바로 true 반환
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // 초 단위
    return decodedToken.exp < currentTime; // 만료 여부 체크
  } catch (error) {
    console.error("Token decoding failed:", error);
    return true; // 디코딩 실패 시 토큰 만료로 간주
  }
};

// Refresh Token을 사용하여 새로운 Access Token을 요청하는 함수
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post("http://localhost:4000/refresh-token", {
      refreshToken,
    });
    const { accessToken } = response.data;
    alert(response?.data);
    console.log("리프레시로 만들어진 토큰 " + accessToken);
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Unable to refresh access token");
  }
};
