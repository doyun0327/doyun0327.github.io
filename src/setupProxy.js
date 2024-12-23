const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // 모든 요청을 localhost:4000으로 프록시
  app.use(
    "/", // /api로 시작하는 모든 요청을
    createProxyMiddleware({
      target: "http://localhost:4000", // 프록시할 서버
      changeOrigin: true, // 원본 호스트를 타겟으로 변경
    })
  );
};
