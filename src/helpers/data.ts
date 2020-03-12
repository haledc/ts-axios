import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  return isPlainObject(data) ? JSON.stringify(data) : data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {
      // do nothing
    }
  }
  return data
}
