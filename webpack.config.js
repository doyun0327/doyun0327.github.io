module.exports = {
    devServer: {
      proxy: {
        '/': {
          target: 'http://localhost:4000',  // 실제 API 서버 주소 (예: http://localhost:4000)
          changeOrigin: true,  // 요청의 Origin을 타겟 서버로 변경
          secure: false,       // HTTPS 서버를 사용할 경우 true로 설정
        }
      }
    }
  };
  