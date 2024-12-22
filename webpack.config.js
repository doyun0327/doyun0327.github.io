const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    // 서버에서 허용할 출처
    headers: {
      'Access-Control-Allow-Origin': '*',  // 모든 출처 허용
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    // 서버가 응답을 보내기 전에 CORS를 허용하도록 설정
    allowedHosts: 'all',
    port: 3000,  // 개발 서버 포트
    // proxy를 이용해 다른 서버로 요청을 보내는 경우
    proxy: {
      '/api': {
        target: 'http://localhost:4000',  // 실제 API 서버 주소
        changeOrigin: true,
        secure: false,  // HTTPS 요청을 허용
      },
    },
  },
};
