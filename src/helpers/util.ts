const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

// 判断是否是 JS 原生对象
// 不包括 FormData ArrayBuffer 等对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// 对象扩展
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深度合并
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          // result[key] 如果已经是个对象了,需要合并
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val) // 递归
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}

// 判断是否是 FormData
export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData
}

// 判断是否是 搜索参数
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
