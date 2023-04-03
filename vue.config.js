const path = require('path');
const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  pages: {
    index: './src/app.js',
    admin: {
      entry: './src/admin/app.js',
      template: './public/admin.html'
    }
  },
  css: {
    loaderOptions: {
      // sass: {
      //   prependData: `@import "@/assets/scss/mixins.scss";`
      // },
      sass: {
        data: '@import "@/assets/scss/mixins.scss";'
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  },
  configureWebpack: config => {
    let env;
    config.resolve.alias['@'] = path.resolve('src');
    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks = false;
      env = require('dotenv').config({ path: path.resolve(__dirname, './.env.production') });
    } else {
      env = require('dotenv').config({path: path.resolve(__dirname, './.env')});
    }
    // переопределяем ENV (нам это нужно, потому что у нас есть env файлы и у backend и у frontend, поэтому расположение их в корне проекта затруднительно)
    const injectingEnv = {};
    for (const k of Object.keys(env.parsed)) {
      injectingEnv[k] = '"' + env.parsed[k].trim('"').trim("'") + '"';
    }
    // удаляем уже определенный DefinePlugin
    config.plugins = config.plugins.filter(plugin => {
      return !Object.keys(plugin).includes('definitions');
    });
    // и запихиваем наш, правильный
    config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': injectingEnv
        })
    );
  },
  transpileDependencies: ['css-loader']
};
