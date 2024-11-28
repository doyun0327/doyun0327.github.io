//express로드 , 이를 통해 express모듈을 제어한다.
require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
//포트 지정
const port = 4000;
const secretKey = process.env.REACT_APP_SECRET_KEY;
const refreshSecretKey = process.env.REACT_APP_REFRESH_SECRET_KEY;
//확인 -  // 이 미들웨어가 있어야 req.body에서 JSON 데이터를 파싱할 수 있습니다.
app.use(express.json());
//app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000", // 허용할 출처
    methods: ["GET", "POST"],
    credentials: true, // 쿠키를 포함하여 요청
  })
);

app.get("/", (req, res) => {
  res.send("연결성공");
});

app.post("/login", (req, res) => {
  try {
    console.log("secretKey" + secretKey);
    const { id, password } = req.body;

    if (id === "test" && password === "test") {
      const payload = { id, name: "테스트" };
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

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
