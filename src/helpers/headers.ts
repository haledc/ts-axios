/*
 * @Author: Hale
 * @Description: 处理请求头和响应头的辅助函数
 * @Date: 2019-05-16
 * @LastEditTime: 2019-05-17
 */
import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

// 处理请求头
// 当请求的数据是对象时，设置请求头文本类型
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return

  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

// 解析响应头
export function parseHeaders(headers: string): object {
  let parsed = Object.create(null)

  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()

    if (!key) {
      return
    }

    if (val) {
      val = val.trim()
    }

    parsed[key] = val
  })

  return parsed
}

// 扁平化请求头
// 提取 header 头的有效字段
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  // 合并有效字段
  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  // 提取后，删除原来的无效字段
  methodsToDelete.forEach(method => delete headers[method])

  return headers
}
