//express로드 , 이를 통해 express모듈을 제어한다.
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
//포트 지정
const port = 4000;
const secretKey = "secretKey";
//확인 -  // 이 미들웨어가 있어야 req.body에서 JSON 데이터를 파싱할 수 있습니다.
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("연결성공");
});

app.post("/login", (req, res) => {
  try {
    const { id, password } = req.body;

    if (id === "test" && password === "test") {
      const payload = { id };
      const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
      console.log("Token generated:", token); // 이 부분이 실행되도록 확인

      res.json({ message: "Login successful", token });
    } else {
      res.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error occurred:", error); // 에러 로그를 찍어줌
    res.status(500).json({ message: "Server error" });
  }
});

// JWT 검증 미들웨어
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // 'Bearer token'에서 token만 추출
  console.log("Token generated222:", token); // 이 부분이 실행되도록 확인
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  // JWT 검증
  jwt.verify(token, secretKey, (err, decoded) => {
    console.log("요기요11");
    if (err) {
      console.log("요기요12");
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded; // decoded된 payload를 req.user에 저장
    next(); // 다음 미들웨어로 이동
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  console.log("protedted들어옴");
  const userId = req.user.id; // JWT에서 추출한 id
  res.json({ message: `안녕하세요, ${userId}님` }); // 사용자에게 인사
});

//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`server open~~~~  http://localhost:${port}`);
});
