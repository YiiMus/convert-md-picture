import { app } from 'electron'
import path from 'path'

/**
 * 获取项目的 package.json 文件内容。
 *
 * @function getPackageJson
 * @description 读取并返回项目根目录下的 package.json 文件内容。
 *              该方法通过 Electron 的 `app.getAppPath()` 获取应用路径，
 *              并结合 Node.js 的 `path` 模块定位 package.json 文件。
 *              如果文件不存在或解析失败，将返回一个空对象作为默认值。
 *
 * @returns {Object} 返回解析后的 package.json 文件内容（JSON 对象）。
 *                   如果文件不存在或解析失败，则返回一个空对象 `{}`。
 */
export const getPackageJson = () => {
    try {
        return require(path.join(app.getAppPath(), 'package.json'))
    } catch (error) {
        console.error('加载 package.json 失败:', error.message)
        return {}
    }
}
