console.log('webpack.config.js is loaded');

module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '/': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    },
    before: (app, server, compiler) => {
      console.log('Webpack dev server is starting...');
      console.log('DevServer Configuration:', module.exports.devServer);
    }
  }
};



// 로그 찍기
console.log('Webpack devServer configuration:', module.exports.devServer);