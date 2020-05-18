import { bind } from "../../src/helpers/bind";

describe("helpers::bind", () => {
  test("should bind an object to a function", function () {
    const obj = { val: 123 };
    const fn = function (this: typeof obj, num: number) {
      return this.val * num;
    };
    const newFn: any = bind(fn, obj);

    expect(newFn(2)).toBe(246);
  });
});
