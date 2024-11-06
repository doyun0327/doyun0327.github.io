//express로드 , 이를 통해 express모듈을 제어한다.
const express = require("express");
const app = express();
//포트 지정
const port = 4000;

//middleware이다.
//client가 "/"경로에 get 요청을 보내면
//req는 요청객체, res는 응답객체 이다.
app.get("/login", (req, res) => {
  res.send("Hello World!");
});

//middleware
//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
