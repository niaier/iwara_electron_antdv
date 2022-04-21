// 'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { mysqlQuery } from '/src/utils/mysql/mysql-query'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { handleBatch } from '/src/utils/thumb/create-thumb'
import { handleCheck } from '/src/utils/check/file-read'




const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.

  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webviewTag: true,
      webSecurity: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  //同步数据
  ipcMain.on('syncMysqlData', async function (ev, data) {

    // 发送消息给渲染进程
    const config = data
    const sql = 'select * from iwara_info where is_down=1'
    mysqlQuery
    const result = await mysqlQuery(config, sql)
    ev.sender.send('syncMysqlDataRe', result)

  })

  //检查文件下载情况
  ipcMain.on('checkedFile', async function (ev, data) {
    const { srcPath } = data
    console.log(srcPath);
    const result = await handleCheck(srcPath)
    const putData = result.checkedList.map(item => {
      item.is_checked = item.hasMp4 ? 1 : 0
      return item
    })
    ev.sender.send('checkedFileRe', putData)
  })

  //生成缩略图
  ipcMain.on('createThumb', function (ev, data) {
    const { srcPath } = data
    console.log(srcPath);
    handleBatch(srcPath)
    ev.sender.send('createThumbRe', srcPath)
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



