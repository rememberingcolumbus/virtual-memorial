module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/remembering-cbus-memorial/'
    : '/',
    transpileDependencies: [
      "vuetify"
    ]
}
