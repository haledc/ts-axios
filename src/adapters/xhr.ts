import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/parseHeaders";
import { createError } from "../core/createError";
import cookies from "../helpers/cookies";
import { isURLSameOrigin } from "../helpers/isURLSameOrigin";
import { settle } from "../core/settle";
import { isFormData, isStandardBrowserEnv, forEach } from "../utils";

export default function xhrAdapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data,
      url,
      method,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
    } = config;

    let request: XMLHttpRequest | null = new XMLHttpRequest();

    request.open(method!.toUpperCase(), url!, true);

    configureRequest();
    addEvents();
    processHeaders();
    processCancel();

    request.send(data);

    function configureRequest(): void {
      if (request != null) {
        if (responseType) {
          (request.responseType as any) = responseType;
        }

        if (timeout) {
          request.timeout = timeout;
        }

        if (withCredentials) {
          request.withCredentials = !!withCredentials;
        }

        if (onDownloadProgress) {
          request.onprogress = onDownloadProgress;
        }

        if (onUploadProgress) {
          request.upload.onprogress = onUploadProgress;
        }
      }
    }

    function addEvents(): void {
      if (request != null) {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) return;

          if (request.status === 0 && request.responseURL?.indexOf("file:") === 0) return;

          const responseHeaders =
            "getAllResponseHeaders" in request && parseHeaders(request.getAllResponseHeaders());

          const responseData =
            responseType && responseType !== "text" ? request.response : request.responseText;

          const response: AxiosResponse = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request,
          };

          settle(resolve, reject, response);
          request = null;
        };

        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError("Request aborted", config, "ECONNABORTED", request));
          request = null;
        };

        request.onerror = function handleError() {
          reject(createError("Network Error", config, null, request));
          request = null;
        };

        request.ontimeout = function handleTimeout() {
          reject(createError(`Timeout of ${timeout} ms exceeded`, config, "ECONNABORTED", request));
          request = null;
        };
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers["Content-Type"];
      }

      if (isStandardBrowserEnv()) {
        if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
          const xsrfValue = cookies.read(xsrfCookieName);

          if (xsrfValue && xsrfHeaderName) {
            headers[xsrfHeaderName] = xsrfValue;
          }
        }
      }

      if (auth) {
        headers["Authorization"] = "Basic " + btoa(auth.username + ":" + auth.password);
      }

      if (request != null && "setRequestHeader" in request) {
        forEach(headers, (val: any, key: string) => {
          if (typeof data === "undefined" && key.toLowerCase() === "content-type") {
            delete headers[key];
          } else {
            request!.setRequestHeader(key, val);
          }
        });
      }
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then((reason) => {
          if (!request) return;

          request.abort();
          reject(reason);

          request = null;
        });
      }
    }
  });
}
