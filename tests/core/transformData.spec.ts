import { transformData } from "../../src/core/transformData";

describe("core::transformData", function () {
  test("should support a single transformer", function () {
    let data;
    data = transformData(data, null, function (data) {
      data = "foo";
      return data;
    });

    expect(data).toBe("foo");
  });

  test("should support an array of transformers", function () {
    let data = "";
    data = transformData(data, null, [
      function (data) {
        data += "f";
        return data;
      },
      function (data) {
        data += "o";
        return data;
      },
      function (data) {
        data += "o";
        return data;
      },
    ]);

    expect(data).toBe("foo");
  });
});
