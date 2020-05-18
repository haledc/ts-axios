export function getAjaxRequest(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent());
    }, 0);
  });
}
