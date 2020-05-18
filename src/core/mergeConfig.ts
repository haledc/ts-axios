import { AxiosRequestConfig } from "../types";
import { isObject, deepMerge, forEach, hasOwn } from "../utils";

const strats = Object.create(null);

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== "undefined" ? val2 : val1;
}

function replaceStrat(val1: any, val2: any): any {
  if (typeof val2 !== "undefined") {
    return val2;
  }
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isObject(val2)) {
    return deepMerge(val1, val2);
  } else if (typeof val2 !== "undefined") {
    return val2;
  } else if (isObject(val1)) {
    return deepMerge(val1);
  } else {
    return val1;
  }
}

const stratKeysForReplace = ["url", "params", "data"];
const stratKeysForDeepMerge = ["headers", "auth", "proxy"];

stratKeysForReplace.forEach((key) => {
  strats[key] = replaceStrat;
});

stratKeysForDeepMerge.forEach((key) => {
  strats[key] = deepMergeStrat;
});

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
  const config = Object.create(null);

  forEach(config2, (_: any, key: string) => {
    mergeField(key);
  });

  forEach(config1, (_: any, key: string) => {
    if (!hasOwn(config2, key)) {
      mergeField(key);
    }
  });

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat; // 根据 key 选择合并策略
    config[key] = strat(config1[key], config2[key]);
  }

  return config;
}
