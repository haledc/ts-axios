import { forEach } from "../utils";

export function normalizeHeaderName(headers: any, normalizedName: string): void {
  forEach(headers, (value: any, name: string) => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
}
