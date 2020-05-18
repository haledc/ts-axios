import { spread } from "../../src/helpers/spread";

describe("helpers::spread", function () {
  test("should spread array to arguments", function () {
    let value = 0;
    spread(function (a: number, b: number) {
      value = a * b;
    })([5, 10]);

    expect(value).toBe(50);
  });

  test("should return callback result", function () {
    const value = spread(function (a: number, b: number) {
      return a * b;
    })([5, 10]);

    expect(value).toBe(50);
  });
});
