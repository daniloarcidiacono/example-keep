module.exports = {
  "publicPath": './',
  "lintOnSave": false,
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    proxy: {
      '^/idp': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        pathRewrite: { '^/idp' : '' }
      },
      '^/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        pathRewrite: { '^/api' : '' }
      }
    }
  }
}