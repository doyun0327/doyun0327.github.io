//express로드 , 이를 통해 express모듈을 제어한다.
const express = require("express");
const app = express();
const cors = require('cors')
//포트 지정
const port = 4000;

//확인 -  // 이 미들웨어가 있어야 req.body에서 JSON 데이터를 파싱할 수 있습니다.
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("연결성공");
});

app.post("/login", (req, res) => {
  const { id, password } = req.body; // req.body에서 id와 password를 바로 추출
  if(id==='test' && password==='test'){
    res.json({ message: "Login successful"});
  }else{
    if(id!=='test'){
      res.json({ message: "id가 잘못되었습니다." });
    }else if(password !== 'test'){
      res.json({ message: "pw가 잘못되었습니다." });

    }
  }
});

//middleware
//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`server open~~~~  http://localhost:${port}`);
});
