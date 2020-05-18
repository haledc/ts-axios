import { trim } from "../../src/utils";

describe("utils::trim", () => {
  test("should trim spaces", () => {
    expect(trim("  foo  ")).toEqual("foo");
  });

  test("should trim tabs", () => {
    expect(trim("\tfoo\t")).toEqual("foo");
  });
});
