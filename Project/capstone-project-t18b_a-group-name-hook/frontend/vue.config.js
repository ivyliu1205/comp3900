// https://cli.vuejs.org/config/#global-cli-config
// Keep non-es6 style
module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath:
    process.env.NODE_ENV === 'production' ? '' : '/',
  outputDir: 'dist',
  productionSourceMap: false, // Setting this to false can speed up production builds if you don't need source maps for production.
  devServer: {
    port: 8081
  }
}
