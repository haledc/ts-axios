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

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

export interface Axios {
  request(config: AxiosRequestConfig): AxiosResponse

  get(url: string, config?: AxiosRequestConfig): AxiosPromise

  post(url: string, config?: AxiosRequestConfig): AxiosResponse

  delete(url: string, config?: AxiosRequestConfig): AxiosResponse

  put(url: string, config?: AxiosRequestConfig): AxiosResponse

  head(url: string, config?: AxiosRequestConfig): AxiosResponse

  options(url: string, config?: AxiosRequestConfig): AxiosResponse

  patch(url: string, config?: AxiosRequestConfig): AxiosResponse
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise

  // 重载，处理 2 个参数的情况
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}
