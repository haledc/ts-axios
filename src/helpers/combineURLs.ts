import { StreamState } from "http2";

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}
