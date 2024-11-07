//express로드 , 이를 통해 express모듈을 제어한다.
const express = require("express");
const app = express();
//포트 지정
const port = 4000;

//확인 -  // 이 미들웨어가 있어야 req.body에서 JSON 데이터를 파싱할 수 있습니다.
app.use(express.json());

app.get("/", (req, res) => {
  res.send("연결성공");
});

app.post("/login", (req, res) => {
  const { id, password } = req.body; // req.body에서 id와 password를 바로 추출
  console.log("Received ID:", id); // id 값 출력
  console.log("Received Password:", password); // password 값 출력
  res.json({ message: "Login successful" });
  //res.send("로그인성공");
});

//middleware
//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
