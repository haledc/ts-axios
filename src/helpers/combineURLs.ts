export function combineURL(baseURL: string, relativeURL?: string) {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}
