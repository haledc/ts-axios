import { AxiosAdapter, AxiosRequestDefaulfConfig } from "./types";
import {
  toString,
  isFormData,
  isArrayBuffer,
  isBuffer,
  isStream,
  isFile,
  isBlob,
  isArrayBufferView,
  isURLSearchParams,
  setContentTypeIfUnset,
  isObject,
} from "./utils";
import xhrAdapter from "./adapters/xhr";
import httpAdapter from "./adapters/http";
import { normalizeHeaderName } from "./helpers/normalizeHeaderName";

const defaults: AxiosRequestDefaulfConfig = {
  adapter: getDefaultAdapter(),

  method: "get",

  timeout: 0,

  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",

  maxContentLength: -1,
  maxBodyLength: -1,

  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
    },
  },

  transformRequest: [
    function (data: any, headers: any): any {
      debugger;
      console.log(data);
      normalizeHeaderName(headers, "Accept");
      normalizeHeaderName(headers, "Content-Type");

      if (
        isFormData(data) ||
        isArrayBuffer(data) ||
        isBuffer(data) ||
        isStream(data) ||
        isFile(data) ||
        isBlob(data)
      ) {
        return data;
      }

      if (isArrayBufferView(data)) {
        return data.buffer;
      }

      if (isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data.toString();
      }

      if (isObject(data)) {
        setContentTypeIfUnset(headers, "application/json;charset=utf-8");
        return JSON.stringify(data);
      }

      return data;
    },
  ],

  transformResponse: [
    function (data: any): any {
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (error) {
          // do nothing
        }
      }
      return data;
    },
  ],

  validateStatus(status: number): boolean {
    return status >= 200 && status < 300;
  },
};

const methodsNoData = ["delete", "get", "head", "options"];

methodsNoData.forEach((method) => {
  defaults.headers[method] = {};
});

const methodsWithData = ["post", "put", "patch"];

methodsWithData.forEach((method) => {
  defaults.headers[method] = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
});

function getDefaultAdapter() {
  let adapter!: AxiosAdapter;
  if (typeof XMLHttpRequest !== "undefined") {
    adapter = xhrAdapter;
  } else if (typeof process !== "undefined" && toString.call(process) === "[object process]") {
    adapter = httpAdapter;
  }

  return adapter;
}

export default defaults;
