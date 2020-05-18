export const toString = Object.prototype.toString;

export const isArray = Array.isArray;

export function isUndefined(val: unknown) {
  return typeof val === "undefined";
}

export function isString(val: unknown) {
  return typeof val === "string";
}

export function isNumber(val: unknown) {
  return typeof val === "number";
}

export function isObject(val: unknown) {
  return val !== null && typeof val === "object";
}

export function isPlainObject(val: unknown) {
  return toString.call(val) === "[object Object]";
}

export function isFunction(val: unknown) {
  return toString.call(val) === "[object Function]";
}

export function isFile(val: unknown) {
  return toString.call(val) === "[object File]";
}

export function isBlob(val: unknown) {
  return toString.call(val) === "[object Blob]";
}

export function isDate(val: unknown) {
  return toString.call(val) === "[object Date]";
}

export function isFormData(val: unknown): boolean {
  return val instanceof FormData;
}

export function isURLSearchParams(val: unknown): val is URLSearchParams {
  return val instanceof URLSearchParams;
}

export function isBuffer(val: any) {
  return (
    val != null &&
    val.constructor != null &&
    typeof val.constructor.isBuffer === "function" &&
    val.constructor.isBuffer(val)
  );
}

export function isArrayBuffer(val: unknown) {
  return toString.call(val) === "[object ArrayBuffer]";
}

export function isArrayBufferView(val: any) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val.buffer instanceof ArrayBuffer;
  }

  return result;
}

export function isStream(val: any) {
  return isObject(val) && isFunction(val.pipe);
}

export function extend<T extends Object, U extends Object>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}

export function merge(...args: any[]) {
  var result: { [key: string]: any } = {};
  function assignValue(val: unknown, key: string) {
    if (typeof result[key] === "object" && typeof val === "object") {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null);

  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val);
          } else {
            result[key] = deepMerge(val);
          }
        } else {
          result[key] = val;
        }
      });
    }
  });

  return result;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key);

export function forEach(obj: any, fn: Function) {
  if (obj == null) return;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else if (isPlainObject(obj)) {
    for (const key in obj) {
      if (hasOwn(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

export function isStandardBrowserEnv() {
  if (
    typeof navigator !== "undefined" &&
    (navigator.product === "ReactNative" ||
      navigator.product === "NaviteScript" ||
      navigator.product === "NS")
  ) {
    return false;
  }

  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function setContentTypeIfUnset(headers: any, value: string) {
  if (!isUndefined(headers) && isUndefined(headers["Content-Type"])) {
    headers["Content-Type"] = value;
  }
}

export function trim(val: string) {
  return val.trim();
}
