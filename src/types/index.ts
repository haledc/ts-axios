/*
 * @Author: Hale
 * @Description: 全局类型和接口
 * @Date: 2019-05-16
 * @LastEditTime: 2019-05-31
 */

// 请求的方法
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'put'
  | 'PUT'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'patch'
  | 'PATCH'

// 请求配置选项
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string

  [propName: string]: any // 索引签名
}

// 请求响应
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// 请求响应的 Promise 类型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// 错误类型
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

// Axios 实例类的接口
export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  getUri(config?: AxiosRequestConfig): string

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 实例对象
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 重载，处理 2 个参数的情况
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 静态实例
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  all<T>(promise: Array<T | Promise<T>>): Promise<T[]>

  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

  Axios: AxiosClassStatic

  // 添加 cancel 属性
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

// 拦截器接口
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

// 转换器
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// 实例类型取消功能接口
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

// 取消功能方法的接口
export interface Canceler {
  (message?: string): void
}

// 类构造函数函数的接口
export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// 取消功能静态类型接口
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}
