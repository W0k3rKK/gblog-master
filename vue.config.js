const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/',
    devServer: {
        port: 8081 // 或者您想要的其他端口号
    }
})
