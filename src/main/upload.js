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
                    isRemote,
                    type: 'image'
                })
            }
        }

        return imageInfos
    } catch (e) {
        console.error('解析 Markdown 出错:', e)
        return []
    }
}

const parseHtmlImageInfos = (content, mdFilePath) => {
    try {
        const dirName = path.dirname(mdFilePath)
        const imageInfos = []
        const regex =
            /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|(\S+))(?:[^>]*\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?(?:[^>]*\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?[^>]*>/gi
        let match

        while ((match = regex.exec(content)) !== null) {
            const src = match[1] || match[2] || match[3]
            const absolutePath = path.resolve(dirName, src)
            const isRemote = /^https?:\/\//i.test(src)

            imageInfos.push({
                absolutePath,
                imageUrl: src,
                lineIndex: content.substr(0, match.index).split(/\r?\n/).length - 1,
                isRemote,
                type: 'html'
            })
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
        const matchImage = line.match(imageRegex)

        if (matchImage) {
            const altText = matchImage[1]
            const title = matchImage[3] ? ` "${matchImage[3]}"` : ''
            const remoteUrl = urlMap.get(index)

            if (remoteUrl) {
                lines[index] = `![${altText}](${remoteUrl}${title})`
            }
        }

        const matchHtmlImg = line.match(/<img\b[^>]*>/i)
        if (matchHtmlImg) {
            // 处理 HTML img 标签
            const srcMatch = matchHtmlImg[0].match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|(\S+))/i)
            if (!srcMatch) continue

            const remoteUrl = urlMap.get(index)

            if (remoteUrl) {
                // 替换 src 属性值，保留其他属性不变
                const beforeSrc = line.slice(0, srcMatch.index)
                const afterSrc = line.slice(srcMatch.index)

                // 正则替换 src 的值，但保留引号或无引号格式
                const newLine =
                    beforeSrc + afterSrc.replace(/\bsrc\s*=\s*(?:"[^"]+"|'[^']+'|\S+)/i, `src="${remoteUrl}"`)

                lines[index] = newLine
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
            const mdImageInfos = praseMdImageInfos(content, filePath)
            const htmlImageInfos = parseHtmlImageInfos(content, filePath)

            const imageInfoList = [...mdImageInfos, ...htmlImageInfos]

            // 本地图片 - 去重
            const localImageList = [
                ...new Map(
                    imageInfoList.filter((i) => !i.isRemote).map((item) => [item.absolutePath, item])
                ).values()
            ]

            if (content) {
                // 解析完成
                event.sender.send('uploadProgress', {
                    id: id,
                    status: 'parsed',
                    data: imageInfoList
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
                    data: imageInfoList
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

                // 构建 Map：absolutePath -> remoteUrl
                const pathToRemoteUrl = new Map()

                // 构建所有行索引与远程 URL 的映射（包括重复路径的）
                const successList = []

                uploadResultList
                    .filter((i) => i?.requestResult?.success)
                    .forEach(({ lineIndex, requestResult }) => {
                        const item = localImageList.find((i) => i.lineIndex === lineIndex)
                        if (item) {
                            const { absolutePath } = item

                            // 第一次遇到这个图片路径，记录远程 URL
                            if (!pathToRemoteUrl.has(absolutePath)) {
                                const remoteUrl = requestResult?.result?.[0] || null
                                pathToRemoteUrl.set(absolutePath, remoteUrl)
                            }

                            // 找出所有使用这个 absolutePath 的行，并添加到 successList
                            imageInfoList
                                .filter((i) => !i.isRemote && i.absolutePath === absolutePath)
                                .forEach((i) => {
                                    successList.push({
                                        lineIndex: i.lineIndex,
                                        remoteUrl: pathToRemoteUrl.get(absolutePath)
                                    })
                                })
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
