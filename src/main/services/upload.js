import fs from 'fs'
import path from 'path'

const praseMdImageInfos = (content, mdFilePath) => {
    try {
        const dirName = path.dirname(mdFilePath)
        const imageInfos = []
        const imageRegex = /!\[(.*?)\]\((.*?)\)/g
        const lines = content.split(/\r?\n/) // 按行分割

        for (const [index, line] of lines.entries()) {
            let match
            while ((match = imageRegex.exec(line)) !== null) {
                const imageUrl = match[2]
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
    } catch (error) {
        console.error('解析 Markdown 出错:', error)
    }
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
            console.log('imageInfos', imageInfos)
        })

        await Promise.all(promises)

        event.sender.send('uploadProgress', 'All files processed')
    } catch (error) {
        console.error('handleUpload Error:', error)
        throw error
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
