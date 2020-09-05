import {
  AxiosRequestConfig,
  Method,
  AxiosPromise,
  Axios as AxiosInterface,
  AxiosResponse,
  ResolvedFn,
  RejectedFn,
} from "../types";
import dispatchRequest, { transformURL } from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>;
  response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
  rejected?: RejectedFn;
}

export default class Axios<T> implements AxiosInterface<T> {
  defaults: AxiosRequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(), // ! 请求拦截表
      response: new InterceptorManager<AxiosResponse>(), // ! 响应拦截表
    };
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === "string") {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    config = mergeConfig(this.defaults, config);

    config.method = config.method.toLowerCase();

    // ! 执行链
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];

    this.interceptors.request.forEach(
      (interceptor) => chain.unshift(interceptor) // ! 从前面加入到执行链中 先进后出
    );
    this.interceptors.response.forEach(
      (interceptor) => chain.push(interceptor) // ! 从后面加入到执行链中 先进先出
    );

    let promise = Promise.resolve(config); // ! 转入 config 作为请求拦截的参数

    // ! 按照顺序执行
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  getUri(config: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config);
    return transformURL(config);
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("get", url, config);
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("delete", url, config);
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("head", url, config);
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("options", url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("post", url, config, data);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("put", url, config, data);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethod("patch", url, config, data);
  }

  private requestMethod(
    method: Method,
    url: string,
    config?: AxiosRequestConfig,
    data?: any
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    );
  }
}
