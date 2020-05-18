import { isDate, isObject, isURLSearchParams, forEach } from "../utils";

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/gi, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) return url;

  let serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    const parts: string[] = [];

    forEach(params, (val: any, key: string) => {
      if (val == null || typeof val === "undefined") return;

      if (Array.isArray(val)) {
        key += "[]";
      } else {
        val = [val];
      }

      forEach(val, (v: any) => {
        if (isDate(v)) {
          v = v.toISOString();
        } else if (isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(`${encode(key)}=${encode(v)}`);
      });
    });

    serializedParams = parts.join("&");
  }

  if (serializedParams) {
    const markIndex = url.indexOf("#");
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }

    url += (url.includes("?") ? "&" : "?") + serializedParams;
  }

  return url;
}
