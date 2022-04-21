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


//
export const handleCheck = function (srcPath) {
  return new Promise((resolve, reject) => {
    resolve(checkUtils(srcPath))
    reject(false);
  })
}
async function checkUtils (srcPath) {
  const dirList = await asyncReaddir(srcPath)
  const checkedList = []
  for (let i = 0; i < dirList.length; i++) {
    {
      const dirPath = path.join(srcPath, dirList[i])
      const contentFileList = await asyncReaddirContent(dirPath)

      const mp4Filename = contentFileList.filter(file => {
        return file.indexOf('.mp4') != -1
      })
      const hasMp4 = mp4Filename.length > 0
      let videoPath = ''
      if (hasMp4) {
        videoPath = path.join(dirPath, mp4Filename[0])
        // console.log(videoPath);
      }
      checkedList.push({
        hasMp4,
        dirPath,
        videoPath,
        dirname: dirList[i]
      })
    }
  }

  // const hasMp4List = checkedList.filter(item => item.hasMp4)
  // const hasNoMp4List = checkedList.filter(item => !item.hasMp4)

  return { checkedList }

}

