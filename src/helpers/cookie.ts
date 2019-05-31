/*
 * @Author: Hale
 * @Description: cookie 相关辅助函数
 * @Date: 2019-05-30
 * @LastEditTime: 2019-05-31
 */

const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
