import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  Method,
  AxiosAdapter,
} from "../types";
import { transformData } from "./transformData";
import defaults from "../defaults";
import { deepMerge } from "../utils";
import { isCancel } from "../cancel/isCancel";
import { isAbsoluteURL } from "../helpers/isAbsoluteURL";
import { combineURL } from "../helpers/combineURLs";
import { buildURL } from "../helpers/buildURL";

export default function dispatchRequest(
  config: AxiosRequestConfig
): AxiosPromise {
  throwIfCancellationRequested(config);

  processConfig(config);

  const adapter: AxiosAdapter = config.adapter ?? defaults.adapter;

  return adapter(config).then(
    (response) => {
      throwIfCancellationRequested(config);
      return transformResponseData(response);
    },
    (reason) => {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        if (reason && reason.response) {
          reason.response = transformResponseData(reason.response);
        }
      }
      return Promise.reject(reason);
    }
  );
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformData(res.data, res.headers, res.config.transformResponse);
  return res;
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config;
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url);
  }
  return buildURL(url!, params, paramsSerializer);
}

function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers;
  }

  headers = deepMerge(headers.common, headers[method], headers);

  const methodsToDelete = [
    "delete",
    "get",
    "head",
    "options",
    "post",
    "put",
    "patch",
    "common",
  ];

  methodsToDelete.forEach((method) => delete headers[method]);

  return headers;
}
