/**
 * @author heart
 * @description 单行注释格式化
 * @Date 2022-06-08
 */
const fs = require('fs')

function getMaxLength(text) {
  // 获取文本的最大长度值 排除 空格
  // 匹配注释前的长度
  const reg = /(.*?)\s*\/\/|(.*)/
  let maxLength = 0
  const array = text.split('\n')
  array.forEach((val) => {
    if (reg.test(val)) {
      maxLength = Math.max(RegExp.$1.length, maxLength, RegExp.$2.length)
    }
  })
  return maxLength
}

// 编码格式
function changeTabs(text, length) {
  const reg = /(.*?)(\s)*\/\//
  const notice = /(\/\/.*)$/
  const array = text.split('\n')
  array.forEach((val, index) => {
    if (reg.test(val)) {
      if (length < RegExp.$1.length) {
        console.log('format error')
        return
      } else {
        const diffLength = length - RegExp.$1.length
        const prefixString = RegExp.$1
        let space = ''
        for (let i = 0; i < diffLength; i++) {
          space += ' '
        }
        const n = val.match(notice)
        array[index] = prefixString + space + (n === null ? '' : n[1])
      }
    }
  })
  return array.join('\n')
}

function writeFile(path, fileName, text) {
  try {
    fs.writeFileSync(path + fileName, text, {
      encoding: 'utf8',
    })
  } catch (e) {
    console.log(e)
  }
}

// 获取文本值
function formatTextNotice(path, fileName, maxLength = 10) {
  try {
    const text = fs.readFileSync(path + fileName, {
      encoding: 'utf8',
    })
    const length = getMaxLength(text)

    console.log('maxLength: %d', length)
    // 读取的文件流 写入到文件中
    const data = changeTabs(text, length + maxLength)
    writeFile(path, fileName, data)
  } catch (e) {
    console.log(e)
  }
}

formatTextNotice(__dirname + '/../', '.prettierrc.js')

module.exports = {
  formatTextNotice,
}
