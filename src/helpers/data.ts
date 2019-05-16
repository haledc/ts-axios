import { isPlainObject } from './util'

/**
 * 处理请求的数据
 * @param data
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 处理相应的数据
 * @param data
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      // do nothing
    }
  }
  return data
}
