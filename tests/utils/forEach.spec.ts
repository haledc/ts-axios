import { forEach } from "../../src/utils";

describe("utils::forEach", () => {
  it("should loop over an array", () => {
    var sum = 0;

    forEach([1, 2, 3, 4, 5], (val: number) => {
      sum += val;
    });

    expect(sum).toBe(15);
  });

  it("should loop over object keys", () => {
    var keys = "";
    var vals = 0;
    var obj = {
      b: 1,
      a: 2,
      r: 3,
    };

    forEach(obj, (v: number, k: string) => {
      keys += k;
      vals += v;
    });

    expect(keys).toBe("bar");
    expect(vals).toBe(6);
  });

  it("should handle undefined gracefully", () => {
    var count = 0;

    forEach(undefined, () => {
      count++;
    });

    expect(count).toBe(0);
  });

  it("should make an array out of non-array argument", () => {
    var count = 0;

    forEach(
      () => {},
      () => {
        count++;
      }
    );

    expect(count).toBe(1);
  });

  it("should handle non object prototype gracefully", () => {
    var count = 0;
    var data = Object.create(null);
    data.foo = "bar";

    forEach(data, () => {
      count++;
    });

    expect(count).toBe(1);
  });
});
