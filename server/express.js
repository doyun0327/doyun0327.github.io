//express로드 , 이를 통해 express모듈을 제어한다.
require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
//포트 지정
const port = 4000;
const secretKey = process.env.REACT_APP_SECRET_KEY;
const refreshSecretKey = process.env.REACT_APP_REFRESH_SECRET_KEY;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // 허용할 출처
    methods: ["GET", "POST"],
    credentials: true, // 쿠키를 포함하여 요청
  })
);

// PostgreSQL 연결 정보 
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password:process.env.DB_PASSWORD,
   port : process.env.DB_PORT
});

// DB 연결 확인
pool.connect()
  .then((client) => {
    console.log('PostgreSQL 데이터베이스에 연결됨!');
    
    // 쿼리 실행 (SELECT * FROM member)
    return client.query('select * from "MEMBER"');
  })
  .then((result) => {
    // 쿼리 결과 확인
    console.log('쿼리 결과:', result.rows);  // member 테이블의 모든 데이터 출력
  })
  .catch((err) => {
    console.error('PostgreSQL 연결 실패:', err.stack);
  });

app.get("/", (req, res) => {
  res.send("연결성공");
});


app.post("/login", (req, res) => {
  try {
    console.log("secretKey" + secretKey);
    const { id, password } = req.body;

    if (id === "test" && password === "test") {
      const payload = { id, name: "테스트" };
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: "5s" });

      // 리프레시 토큰 생성 (유효 기간 7일)
      const refreshToken = jwt.sign(payload, refreshSecretKey, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
      });
    } else {
      res.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get-date

app.get("/get-date", (req, res) => {
  try {
    const currentDate = new Date().toLocaleString();  // 현재 날짜 및 시간
    res.status(200).json({ date: currentDate });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh Token을 이용한 새로운 Access Token 발급
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // Refresh Token을 검증
  jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // 리프레시 토큰이 유효한 경우 새로운 access token 발급
    const payload = { id: decoded.id, name: decoded.name };
    const newAccessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.json({ accessToken: newAccessToken });
  });
});


// 이게 미들웨어가 될 계획
app.get("/protected", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 'Bearer token'에서 token만 추출

  if (!token) {
    return res.status(401).json({ message: "토큰이 존재하지 않습니다." });
  }
  const decoded = jwt.decode(token);
  console.log("decoded:" + JSON.stringify(decoded));
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      //토큰 유효x, 변조
      return res.status(403).json({ message: "Invalid token" });
    }

    const userIdFromToken = decoded.id;
    if (userIdFromToken === "test") {
      // "로그인한 사용자의 id"는 예시로 사용
      res.status(200).json({ result: decoded });
    } else {
      res.status(403).json({ message: "User ID does not match" });
    }
  });
});

//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`server open~~~~  http://localhost:${port}`);
});
