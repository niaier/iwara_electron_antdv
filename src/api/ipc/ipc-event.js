
import { handleBatch } from '/src/utils/thumb/create-thumb'
import { handleCheck } from '/src/utils/check/file-read'
import { mysqlQuery } from '/src/utils/mysql/mysql-query'
import { ipcMain } from 'electron'



function ipcInit () {
  //同步数据
  ipcMain.on('syncMysqlData', async function (ev, data) {

    // 发送消息给渲染进程
    const config = data
    const sql = 'select * from iwara_info where is_down=1'
    const result = await mysqlQuery(config, sql)
    ev.sender.send('syncMysqlDataRe', result)

  })

  //检查文件下载情况
  ipcMain.on('checkedFile', async function (ev, data) {
    const { srcPath } = data
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
    handleBatch(srcPath)
    ev.sender.send('createThumbRe', srcPath)
  })

}


export { ipcInit }