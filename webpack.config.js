export const devServer = {
  port: 3000, // 개발 서버 포트, 클라이언트 앱 포트와 일치 (개발 중에는 보통 3000)
  proxy: {
    '/': {
      target: 'http://localhost:4000', // 백엔드 서버의 포트 (localhost:4000)
      changeOrigin: true, // 요청의 Origin을 타겟 서버로 변경
      secure: false, // HTTPS를 사용할 경우 true로 설정
    }
  }
};
