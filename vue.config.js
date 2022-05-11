
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['fluent-ffmpeg'],
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        appId: "iwara_electron_antdv",
        win: {
          "icon": "./icon.png"
        },
        nsis: {
          "oneClick": false,
          "allowToChangeInstallationDirectory": true,
        }

      }
    }
  },
}