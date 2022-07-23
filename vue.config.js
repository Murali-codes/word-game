module.exports = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      config.module
        .rule('istanbul')
        .test(/\.(js|vue)$/)
        .use('istanbul-instrumenter-loader')
        .loader('istanbul-instrumenter-loader')
        .options({ esModules: true })
        .end();
    }
  },
};
