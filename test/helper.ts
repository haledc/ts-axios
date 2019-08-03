// @ts-ignore
export function getAjaxRequest(): Promise<jasmineAjaxRequest> {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
