/*
 * @Author: Hale
 * @Description: helper
 * @Date: 2019-06-02
 * @LastEditTime: 2019-06-06
 */
// @ts-ignore
export function getAjaxRequest(): Promise<jasmineAjaxRequest> {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
