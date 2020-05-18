import { merge } from "../../src/utils";

describe("utils::merge", () => {
  test("should be immutable", () => {
    const a: any = {};
    const b: any = { foo: 123 };
    const c: any = { bar: 456 };

    merge(a, b, c);

    expect(typeof a.foo).toBe("undefined");
    expect(typeof a.bar).toBe("undefined");
    expect(typeof b.bar).toBe("undefined");
    expect(typeof c.foo).toBe("undefined");
  });

  test("should merge properties", () => {
    const a = { foo: 123 };
    const b = { bar: 456 };
    const c = { foo: 789 };
    const d = merge(a, b, c);

    expect(d.foo).toBe(789);
    expect(d.bar).toBe(456);
  });

  test("should merge recursively", () => {
    const a = { foo: { bar: 123 } };
    const b = { foo: { baz: 456 }, bar: { qux: 789 } };

    expect(merge(a, b)).toEqual({
      foo: {
        bar: 123,
        baz: 456,
      },
      bar: {
        qux: 789,
      },
    });
  });
});
