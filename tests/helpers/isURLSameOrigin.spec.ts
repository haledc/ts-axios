import { isURLSameOrigin } from "../../src/helpers/isURLSameOrigin";

describe("helpers::isURLSameOrigin", () => {
  test("should detect same origin", () => {
    expect(isURLSameOrigin(window.location.href)).toBe(true);
  });

  test("should detect different origin", () => {
    expect(isURLSameOrigin("https://github.com/axios/axios")).toBe(false);
  });
});
