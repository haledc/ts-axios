/*
 * @Author: Hale
 * @Description: 取消原因
 * @Date: 2019-05-23
 * @LastEditTime: 2019-05-24
 */

export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
