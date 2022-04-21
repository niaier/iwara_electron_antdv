const fs = require('fs');
const path = require('path');
const Ffmpeg = require('fluent-ffmpeg')
const child = require('child_process')

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
export const handleBatch = async function (srcPath) {
  const dirList = await asyncReaddir(srcPath)
  for (let i = 0; i < dirList.length; i++) {
    const dirPath = path.join(srcPath, dirList[i])
    const contentFileList = await asyncReaddirContent(dirPath)

    const hasGif = contentFileList.indexOf('thumb.gif') != -1
    const hasJpg = contentFileList.indexOf('thumb.jpg') != -1
    const hasVideo = contentFileList.filter(item => {
      return item.indexOf('.mp4') != -1
    }).length > 0


    const flag = !hasGif && !hasJpg && hasVideo
    if (flag) {
      const videoName = contentFileList.filter(item => { return item.indexOf('.mp4') != -1 })[0]
      const videoPath = path.join(dirPath, videoName)

      const result = await asyncHandlePic(videoPath, dirPath)
      if (result) {
        console.log('完成', videoPath);
      }




    }
  }
}

//ffmpeg处理生成视频相关图片和gif
function asyncHandlePic (videoPath, dirPath) {
  return new Promise((resolve, reject) => {
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
              resolve(true)
            } else {
              reject(err)
            }
          })
        })



      });

  })

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
        console.log('生成缩略图', dirPath);
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
        console.log('生成片段', dirPath, section);
        resolve(true)
      })
  })

}

// 合并到mp4
function mergeVideo (dirPath) {
  // const command = new Ffmpeg()
  const path1 = path.join(dirPath, 'section1.ts')
  const path2 = path.join(dirPath, 'section2.ts')
  const path3 = path.join(dirPath, 'section3.ts')
  const path4 = path.join(dirPath, 'section4.ts')
  const path5 = path.join(dirPath, 'section5.ts')
  const thumbMp4Path = path.join(dirPath, 'thumb.mp4')

  return new Promise((resolve, reject) => {
    // command
    //   .input(path1)
    //   .input(path2)
    //   .input(path3)
    //   .input(path4)
    //   .input(path5)
    //   .outputOptions([
    //     '-s 378x212',
    //   ])
    //   .on('error', (err) => {
    //     reject(err)
    //   })
    //   .on('end', () => {
    //     console.log('合并thumb成功', dirPath);
    //     resolve(true)
    //   })
    //   .mergeToFile(thumbMp4Path, dirPath)
    const cmd = `ffmpeg -i "concat:${path1}|${path2}|${path3}|${path4}|${path5}" -s 378x212 -r 15 -codec copy ${thumbMp4Path}`
    console.log(cmd);
    child.exec(cmd, function (err) {
      if (err) {
        console.log(err.message);
        reject(err)
      } else {
        console.log('合并thumb成功', dirPath);
        resolve(true)
      }
    })
  }).catch(err => {
    console.log('================', err);
    // fs.appendFile('check_err_log.txt', err, (err) => {
    //   if (err) throw err
    //   else {
    //     console.log('错误日志写入成功');
    //   }
    // });
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
      .outputOptions([
        '-s 378x212',
        '-r 15'
      ])
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
