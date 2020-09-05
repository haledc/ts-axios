export type Method =
  | "get"
  | "GET"
  | "post"
  | "POST"
  | "delete"
  | "DELETE"
  | "put"
  | "PUT"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export interface AxiosAdapter {
  (config: AxiosRequestConfig): AxiosPromise<any>;
}

export interface AxiosProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
  protocol?: string;
}

export type ResponseType = XMLHttpRequestResponseType | "stream";

export interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: ResponseType;
  timeout?: number;
  timeoutErrorMessage?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  cancelToken?: CancelToken;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onDownloadProgress?: (e: ProgressEvent) => void;
  onUploadProgress?: (e: ProgressEvent) => void;
  auth?: AxiosBasicCredentials;
  validateStatus?: (status: number) => boolean;
  paramsSerializer?: (params: any) => string;
  baseURL?: string;
  adapter?: AxiosAdapter;
  maxContentLength?: number;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  decompress?: boolean;

  [propName: string]: any;
}

export type AxiosRequestDefaulfConfig = Required<
  Pick<
    AxiosRequestConfig,
    | "adapter"
    | "method"
    | "timeout"
    | "xsrfCookieName"
    | "xsrfHeaderName"
    | "maxContentLength"
    | "maxBodyLength"
    | "headers"
    | "transformRequest"
    | "transformResponse"
    | "validateStatus"
  >
>;

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: any;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
  isAxiosError: boolean;
}

export interface Axios<T> {
  defaults: AxiosRequestConfig;

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };

  getUri(config?: AxiosRequestConfig): string;

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T>;

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T>;

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T>;
}

export interface AxiosInstance<T> extends Axios<T> {
  (config: AxiosRequestConfig): AxiosPromise<T>;
  (url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosStatic<T> extends AxiosInstance<T> {
  create(config?: AxiosRequestConfig): AxiosInstance<T>;
  all<T>(promise: Array<T | Promise<T>>): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R;
  Axios: AxiosClassStatic<T>;

  CancelToken: CancelTokenStatic;
  Cancel: CancelStatic;
  isCancel: (value: any) => boolean;
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;
  eject(id: number): void;
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>;
}

export interface RejectedFn {
  (error: any): any;
}

export interface AxiosTransformer {
  (data: any, headers?: any): any;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  throwIfRequested(): void;
}

export interface Canceler {
  (message?: string): void;
}

export interface CancelExecutor {
  (cancel: Canceler): void;
}

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken;

  source(): CancelTokenSource;
}

export interface Cancel {
  message?: string;
}

export interface CancelStatic {
  new (message?: string): Cancel;
}

export interface AxiosBasicCredentials {
  username: string;
  password: string;
}

export interface AxiosClassStatic<T> {
  new (config: AxiosRequestConfig): Axios<T>;
}
