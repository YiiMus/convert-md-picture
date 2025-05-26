import fs from 'fs'
import path from 'path'
import axios from 'axios'
import dayjs from 'dayjs'

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

const replaceLocalImageUrl = (content, successList, filePath, fileName) => {
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

    // 自动识别原始换行符
    const lineBreak = content.includes('\r\n') ? '\r\n' : '\n'
    const newContent = lines.join(lineBreak)

    // 构建输出路径
    const dir = path.dirname(filePath)
    const [prefix, suffix] = fileName.split('.')

    const timestamp = dayjs().unix() // 获取当前秒级时间戳（Unix 时间戳）
    const newFileName = `${prefix} - ${timestamp}.${suffix}`

    const outputPath = path.join(dir, newFileName)

    // 写入文件
    fs.writeFileSync(outputPath, newContent, 'utf-8')

    return outputPath
}

const readFile = async (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf-8')
    } catch (e) {
        console.error('读取文件出错:', e)
    }
}

const uploadImage = async (event, fileList = []) => {
    try {
        const promises = fileList.map(async (item) => {
            const { filePath, id, fileName } = item

            // 解析中
            event.sender.send('uploadProgress', {
                id: id,
                status: 'parsing'
            })

            const content = await readFile(filePath)

            // 解析 md 文件中所有的图片信息
            const imageInfos = praseMdImageInfos(content, filePath)
            const localImageList = imageInfos.filter((i) => !i.isRemote)

            if (content) {
                // 解析完成
                event.sender.send('uploadProgress', {
                    id: id,
                    status: 'parsed',
                    data: imageInfos
                })
            }

            // 上传结果
            const uploadResultList = []

            const uploadTasks = localImageList.map((i) => {
                const task = handleUpload(i.absolutePath)
                task.then((result) => {
                    uploadResultList.push({
                        lineIndex: i.lineIndex,
                        requestResult: result
                    })

                    // 通知渲染进程上传进度
                    event.sender.send('uploadProgress', {
                        id: id,
                        status: 'uploading',
                        data: {
                            totalCount: localImageList.length,
                            uploadedCount: uploadResultList.length
                        }
                    })
                })
                return task
            })

            if (uploadTasks?.length > 0) {
                // 开始上传
                event.sender.send('uploadProgress', {
                    id: id,
                    status: 'startUpload',
                    data: imageInfos
                })
            }

            try {
                await Promise.all(uploadTasks)

                // 统计上传结果
                const successCount = uploadResultList.filter((item) => item.requestResult.success).length
                const failureCount = uploadResultList.length - successCount

                if (uploadResultList.length === uploadTasks.length && uploadTasks.length > 0) {
                    // 上传结束
                    event.sender.send('uploadProgress', {
                        id: id,
                        status: 'uploaded',
                        data: {
                            totalCount: uploadResultList.length,
                            successCount: successCount,
                            failureCount: failureCount
                        }
                    })
                }

                const successList = uploadResultList
                    .filter((i) => i?.requestResult?.success)
                    .map((i) => {
                        return {
                            lineIndex: i.lineIndex,
                            remoteUrl: i.requestResult?.result?.[0] || null
                        }
                    })

                // 输出路径
                let outputPath = null

                if (successList.length > 0) {
                    // 构建文件
                    event.sender.send('uploadProgress', {
                        id: id,
                        status: 'building'
                    })

                    outputPath = replaceLocalImageUrl(content, successList, filePath, fileName)

                    if (outputPath) {
                        // 构建完成
                        event.sender.send('uploadProgress', {
                            id: id,
                            status: 'builded'
                        })
                    }
                }

                // 任务完成
                event.sender.send('uploadProgress', {
                    id: id,
                    status: 'taskFinished',
                    data: {
                        isBuild: !!outputPath,
                        outputPath: outputPath || ''
                    }
                })
            } catch (error) {
                console.error('上传出错:', error)
            }
        })

        await Promise.all(promises)
    } catch (e) {
        console.error('handleUpload Error:', e)
        throw e
    }
}
export { uploadImage }
