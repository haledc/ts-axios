import { extend } from "../../src/utils";

describe("utils::extend", () => {
  test("should be mutable", () => {
    const a: any = {};
    const b = { foo: 123 };

    extend(a, b);

    expect(a.foo).toBe(b.foo);
  });

  test("should extend properties", () => {
    let a = { foo: 123, bar: 456 };
    const b = { bar: 789 };

    a = extend(a, b);

    expect(a.foo).toBe(123);
    expect(a.bar).toBe(789);
  });
});
