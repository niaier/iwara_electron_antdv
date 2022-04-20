const fs = require('fs');
const path = require('path');
const Ffmpeg = require('fluent-ffmpeg')


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


//批量处理L
const handleBatch = async function (srcPath) {
  const dirList = await asyncReaddir(srcPath)
  dirList.forEach(async (dirname) => {
    const dirPath = path.join(srcPath, dirname)
    const contentFileList = await asyncReaddirContent(dirPath)
    if (contentFileList.indexOf('thumb.gif') == -1 || contentFileList.indexOf('thumb.jpg') == -1) {
      contentFileList.forEach(async file => {
        if (file.indexOf('.mp4') != -1) {
          console.log(file, '生成缩略图');
          const videoPath = path.join(dirPath, file)
          await asyncHandlePic(videoPath, dirPath)
        }
      })
    }

  })
}

//ffmpeg处理生成视频相关图片和gif
function asyncHandlePic (videoPath, dirPath) {
  //获取文件时长
  const command = new Ffmpeg()
  command.input(videoPath)
    .ffprobe(async function (err, data) {
      const duration = data.format.duration
      const p20 = Math.floor(duration * 0.2)
      const p50 = Math.floor(duration * 0.5)
      const p70 = Math.floor(duration * 0.7)
      const p90 = Math.floor(duration * 0.90)
      // console.log(
      //   p20,
      //   p50,
      //   p70,
      //   p90)

      await asyncThumbJpg(videoPath, dirPath)

      await asyncSliceVideo(videoPath, dirPath, 5, 1)

      await asyncSliceVideo(videoPath, dirPath, p20, 2)

      await asyncSliceVideo(videoPath, dirPath, p50, 3)

      await asyncSliceVideo(videoPath, dirPath, p70, 4)

      await asyncSliceVideo(videoPath, dirPath, p90, 5)

      await mergeVideo(dirPath)

      await transToGif(dirPath)

      // 删除文件
      const unlinkList = ['section1.ts', 'section2.ts', 'section3.ts', 'section4.ts', 'section5.ts', 'thumb.mp4']
      unlinkList.forEach(file => {
        const filePath = path.join(dirPath, file)
        fs.unlink(filePath, (err) => {
          if (!err) {
            console.log('删除成功', filePath);
          }
        })
      })



    });

}
//生成缩略图
function asyncThumbJpg (videoPath, dirPath) {
  const command = new Ffmpeg()
  return new Promise((resolve, reject) => {
    command
      .input(videoPath)
      .screenshots({
        timestamps: ['5'],
        filename: 'thumb.jpg',
        folder: dirPath,
        size: '378x212'
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        console.log('生成缩略图');
        resolve(true)
      })
  })

}
// 切片视频
function asyncSliceVideo (videoPath, dirPath, startTime, section) {
  const command = new Ffmpeg()
  return new Promise((resolve, reject) => {
    command
      .input(videoPath)
      .outputOptions([
        `-ss ${startTime}`,
        '-t 3',
        '-s 378x212',
        '-r 15',
      ])
      .save(`${dirPath}/section${section}.ts`)
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        console.log('生成片段', section);
        resolve(true)
      })
  })

}

// 合并到mp4
function mergeVideo (dirPath) {
  const command = new Ffmpeg()
  const path1 = path.join(dirPath, 'section1.ts')
  const path2 = path.join(dirPath, 'section2.ts')
  const path3 = path.join(dirPath, 'section3.ts')
  const path4 = path.join(dirPath, 'section4.ts')
  const path5 = path.join(dirPath, 'section5.ts')
  const thumbMp4Path = path.join(dirPath, 'thumb.mp4')

  return new Promise((resolve, reject) => {
    command
      .input(path1)
      .input(path2)
      .input(path3)
      .input(path4)
      .input(path5)
      .mergeToFile(thumbMp4Path)
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        console.log('合并thumb成功');
        resolve(true)
      })
  })

}

//转换为gif
function transToGif (dirPath) {
  const command = new Ffmpeg()
  const thumbMp4Path = path.join(dirPath, 'thumb.mp4')
  const thumbGifPath = path.join(dirPath, 'thumb.gif')
  command
  return new Promise((resolve, reject) => {
    command
      .input(thumbMp4Path)
      .save(thumbGifPath)
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        console.log('生成gif成功')
        resolve(true)
      })
  })
}
handleBatch('D:/iwara_dwon/test')

exports.handleBatch = handleBatch