import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context) // 新建实例指向类的【原型】的 request 方法
  extend(instance, context) // 继承所有的 context 方法和属性
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
