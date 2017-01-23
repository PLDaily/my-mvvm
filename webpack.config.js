module.exports = {
  entry: ['babel-polyfill', './test.js'],
  entry: './main',//入口文件
  output: {
    filename: 'bundle.js'//输出文件
  },
  module: {
    loaders: [{
      test: /\.js$/,//正则匹配文件，对其进行解析
      exclude: /node_modules/,//不对node_modules里的js文件进行解析
      loader: 'babel',//使用babel加载器
      query: {
        presets: ['es2015', 'stage-0']//解析成ES5的形式
      }
    }]
  }
}