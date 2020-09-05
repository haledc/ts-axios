import Cancel from "./Cancel";

export function isCancel(value: unknown): boolean {
  return value instanceof Cancel;
}
