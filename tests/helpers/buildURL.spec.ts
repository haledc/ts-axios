import { buildURL } from "../../src/helpers/buildURL";

describe("helpers::buildURL", () => {
  test("should support null params", () => {
    expect(buildURL("/foo")).toBe("/foo");
  });

  test("should support params", () => {
    expect(
      buildURL("/foo", {
        foo: "bar",
      })
    ).toBe("/foo?foo=bar");
  });

  test("should ignore if some param value is null", () => {
    expect(
      buildURL("/foo", {
        foo: "bar",
        baz: null,
      })
    ).toBe("/foo?foo=bar");
  });

  test("should support object params", () => {
    expect(
      buildURL("/foo", {
        foo: {
          bar: "baz",
        },
      })
    ).toBe("/foo?foo=" + encodeURI('{"bar":"baz"}'));
  });

  test("should support date params", () => {
    const date = new Date();

    expect(
      buildURL("/foo", {
        date: date,
      })
    ).toBe("/foo?date=" + date.toISOString());
  });

  test("should support array params", () => {
    expect(
      buildURL("/foo", {
        foo: ["bar", "baz"],
      })
    ).toBe("/foo?foo[]=bar&foo[]=baz");
  });

  test("should support special char params", () => {
    expect(
      buildURL("/foo", {
        foo: "@:$, ",
      })
    ).toBe("/foo?foo=@:$,+");
  });

  test("should support existing params", () => {
    expect(
      buildURL("/foo?foo=bar", {
        bar: "baz",
      })
    ).toBe("/foo?foo=bar&bar=baz");
  });

  test("should correct discard url hash mark", () => {
    expect(
      buildURL("/foo?foo=bar#hash", {
        query: "baz",
      })
    ).toBe("/foo?foo=bar&query=baz");
  });

  test("should use serializer if provided", () => {
    const serializer = jest.fn(() => {
      return "foo=bar";
    });
    const params = { foo: "bar" };

    expect(buildURL("/foo", params, serializer)).toBe("/foo?foo=bar");
    expect(serializer).toHaveBeenCalled();
    expect(serializer).toHaveBeenCalledWith(params);
  });

  test("should support URLSearchParams", () => {
    expect(buildURL("/foo", new URLSearchParams("bar=baz"))).toBe(
      "/foo?bar=baz"
    );
  });
});
