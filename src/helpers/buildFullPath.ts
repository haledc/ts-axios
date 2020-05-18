import { combineURL } from "../helpers/combineURLs";
import { isAbsoluteURL } from "../helpers/isAbsoluteURL";

export function buildFullPath(baseURL: string, requestedURL: string) {
  if (baseURL && !isAbsoluteURL(requestedURL!)) {
    return combineURL(baseURL, requestedURL);
  }

  return requestedURL;
}
