const fs = require('fs');
const path = require('path');

// 读取文件夹列表
function asyncReaddir (srcPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(srcPath, (err, file) => {
      if (err) {
        reject(err);
      }
      resolve(file)
    })
  })
}

// 读取文件夹内部内容
function asyncReaddirContent (dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, file) => {
      if (err) {
        reject(err);
      }
      resolve(file)
    })
  })
}


//批量处理
export const handleCheck = async function (srcPath) {
  const dirList = await asyncReaddir(srcPath)
  const checkedList = []
  dirList.forEach(async item => {
    const dirPath = path.join(srcPath, item)
    const contentFileList = await asyncReaddirContent(dirPath)
    contentFileList.filter(file => {
      return file.indexOf('.mp4') != -1
    })
    const hasMp4 = contentFileList.length > 0
    const videoPath = path.join(dirPath, contentFileList[0])
    checkedList.push({
      hasMp4,
      dirPath,
      videoPath
    })
  })
  const hasMp4List = checkedList.filter(item => item.hasMp4)
  const hasNoMp4List = checkedList.filter(item => !item.hasMp4)
  console.log(dirList.length);
  console.log(hasMp4List.length, '|', hasNoMp4List);

}

