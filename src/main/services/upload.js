import fs from 'fs'
import path from 'path'
import axios from 'axios'

// 精确匹配 Markdown 图片语法并保留 alt 和 title
const imageRegex = /^!\[([^\]]*)\]\(\s*((?:[^()]|\([^)]*\))*)\s*(?:"([^"]*)")?\)/

const handleUpload = async (imageUrl) => {
    try {
        const result = await axios.post(
            'http://127.0.0.1:36677/upload',
            JSON.stringify({
                list: [imageUrl]
            })
        )
        return result.data
    } catch (e) {
        console.error(e)
    }
}

const praseMdImageInfos = (content, mdFilePath) => {
    try {
        const dirName = path.dirname(mdFilePath)
        const imageInfos = []
        const lines = content.split(/\r?\n/) // 按行分割

        for (const [index, line] of lines.entries()) {
            const match = line.match(imageRegex)

            if (match) {
                const imageUrl = match[2] // 提取括号中的 URL 部分
                const absolutePath = path.resolve(dirName, imageUrl)

                // 判断是否是网络图片
                const isRemote = /^https?:\/\//i.test(imageUrl)

                imageInfos.push({
                    absolutePath,
                    imageUrl,
                    lineIndex: index,
                    isRemote
                })
            }
        }

        return imageInfos
    } catch (e) {
        console.error('解析 Markdown 出错:', e)
        return []
    }
}

const replaceLocalImageUrl = (content, successList) => {
    const lines = content.split(/\r?\n/)
    const urlMap = new Map(successList.map((item) => [item.lineIndex, item.remoteUrl]))

    for (const [index, line] of lines.entries()) {
        const match = line.match(imageRegex)

        if (match) {
            const altText = match[1]
            const title = match[3] ? ` "${match[3]}"` : ''
            const remoteUrl = urlMap.get(index)

            if (remoteUrl) {
                lines[index] = `![${altText}](${remoteUrl}${title})`
            }
        }
    }

    const newContent = lines.join('\n')
    console.log('newContent: \n', newContent)
    console.log('end')
}

const readFile = async (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf-8')
    } catch (e) {
        console.error('读取文件出错:', e)
    }
}

const uploadImage = async (event, filePathList = []) => {
    try {
        const promises = filePathList.map(async (filePath) => {
            const content = await readFile(filePath)

            // 解析 md 文件中所有的图片信息
            const imageInfos = praseMdImageInfos(content, filePath)
            const localImageList = imageInfos.filter((i) => !i.isRemote)

            // 上传结果
            const uploadResultList = []

            const uploadTasks = localImageList.map((i) => {
                const task = handleUpload(i.absolutePath)
                task.then((result) => {
                    // 通知渲染进程上传进度
                    uploadResultList.push({
                        lineIndex: i.lineIndex,
                        requestResult: result
                    })
                    event.sender.send('uploadProgress', {
                        totalCount: localImageList.length,
                        uploadedCount: uploadResultList.length
                    })
                })
                return task
            })

            try {
                await Promise.all(uploadTasks)
                console.log(`上传结果:  ${filePath} `, uploadResultList)
                const successList = uploadResultList
                    .filter((i) => i?.requestResult?.success)
                    .map((i) => {
                        return {
                            lineIndex: i.lineIndex,
                            remoteUrl: i.requestResult?.result?.[0] || null
                        }
                    })
                console.log('上传成功的图片：', successList)
                replaceLocalImageUrl(content, successList)
            } catch (error) {
                console.error('上传出错:', error)
            }
        })

        await Promise.all(promises)

        event.sender.send('uploadProgress', 'All files processed')
    } catch (e) {
        console.error('handleUpload Error:', e)
        throw e
    }
}
export { uploadImage }

// try {
//     // 模拟上传过程
//     for (let i = 0; i <= 100; i += 10) {
//         await new Promise((resolve) => setTimeout(resolve, 100))
//         event.sender.send('uploadProgress', i) // 主动推送进度
//     }

//     // 模拟上传完成
//     const result = `Uploaded ${filePathList.length} files`
//     event.sender.send('uploadProgress', result)
//     return result
// } catch (error) {
//     event.sender.send('uploadProgress', error)
//     throw error
// }
