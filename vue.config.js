const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || '0.1.0'

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/starshark_monitor.vue/" : "/",
<<<<<<< Updated upstream
  transpileDependencies: true
=======
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        }
      })
    ]
  }
>>>>>>> Stashed changes
})
