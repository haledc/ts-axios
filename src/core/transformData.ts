import { AxiosTransformer } from "../types";
import { forEach } from "../utils";

export function transformData(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  forEach(fns, (fn: AxiosTransformer) => {
    data = fn(data, headers);
  });

  return data;
}
