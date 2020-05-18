import Cancel from "../../src/cancel/Cancel";
import { isCancel } from "../../src/cancel/isCancel";

describe("isCancel", () => {
  test("should returns true if value is a Cancel", () => {
    expect(isCancel(new Cancel())).toBe(true);
  });

  test("should returns false if value is not a Cancel", () => {
    expect(isCancel({ foo: "bar" })).toBe(false);
  });
});
