const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/starshark_monitor.vue/" : "/",
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map"
  }
})
