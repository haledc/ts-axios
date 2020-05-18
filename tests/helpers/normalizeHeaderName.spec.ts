import { normalizeHeaderName } from "../../src/helpers/normalizeHeaderName";

describe("helpers::normalizeHeaderName", () => {
  test("should normalize matching header name", () => {
    const headers: { [key: string]: any } = {
      "conTenT-Type": "foo/bar",
    };
    normalizeHeaderName(headers, "Content-Type");
    expect(headers["Content-Type"]).toBe("foo/bar");
    expect(headers["conTenT-Type"]).toBe(undefined);
  });

  test("should not change non-matching header name", () => {
    const headers: { [key: string]: any } = {
      "content-type": "foo/bar",
    };
    normalizeHeaderName(headers, "Content-Length");
    expect(headers["content-type"]).toBe("foo/bar");
    expect(headers["Content-Length"]).toBe(undefined);
  });
});
