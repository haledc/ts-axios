import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

const strats = Object.create(null)

// 默认合并策略 -> 有用户配置使用用户配置（包括 null），没有则使用默认配置
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 替换合并策略 -> 使用用户配置，忽略默认配置
function replaceStrat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 深度合并策略
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

// 使用替换合并策略的字段
const stratKeysReplace = ['url', 'params', 'data']

stratKeysReplace.forEach(key => {
  strats[key] = replaceStrat
})

// 使用深度合并策略的字段
const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
  const config = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat // 根据 key 选择合并策略
    config[key] = strat(config1[key], config2[key])
  }

  return config
}
