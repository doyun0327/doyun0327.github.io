const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // 모든 출처에서의 요청을 허용

// 요청 로그 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // 요청 메서드와 URL 로그 출력
  next(); // 다음 미들웨어로 이동
});

// 기본 엔드포인트 로그
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// /api 엔드포인트
app.get('/api', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
