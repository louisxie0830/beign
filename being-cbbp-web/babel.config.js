module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry'
      }
    ]
  ],
  // 'plugins': [
  //   [
  //     'import',
  //     {
  //       'libraryName': 'vxe-table',
  //       'style': true // 样式是否也按需加载
  //     }
  //   ]
  // ]
  // if your use import on Demand, Use this code
  // ,
  plugins: [
    [ 'import', {
      'libraryName': 'ant-design-vue',
      'libraryDirectory': 'es',
      'style': true // `style: true` 会加载 less 文件
    } ],
    // [
    //   'import',
    //   {
    //     'libraryName': 'vxe-table',
    //     'style': true // 样式是否也按需加载
    //   },
    //   'vxe-table'
    // ]
  ]
}
