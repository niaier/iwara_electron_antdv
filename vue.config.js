
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['fluent-ffmpeg'],
      nodeModulesPath: ['../../node_modules', './node_modules']
    }
  },
}