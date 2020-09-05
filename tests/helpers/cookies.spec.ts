import cookies from "../../src/helpers/cookies";

describe("helpers::cookies", () => {
  afterEach(function () {
    // Remove all the cookies
    const expires = Date.now() - 60 * 60 * 24 * 7;
    document.cookie
      .split(";")
      .map(function (cookie) {
        return cookie.split("=")[0];
      })
      .forEach(function (name) {
        document.cookie =
          name + "=; expires=" + new Date(expires).toUTCString();
      });
  });

  test("should write cookies", function () {
    cookies.write("foo", "baz");
    expect(document.cookie).toBe("foo=baz");
  });

  test("should read cookies", function () {
    cookies.write("foo", "abc");
    cookies.write("bar", "def");
    expect(cookies.read("foo")).toBe("abc");
    expect(cookies.read("bar")).toBe("def");
  });

  test("should remove cookies", function () {
    cookies.write("foo", "bar");
    cookies.remove("foo");
    expect(cookies.read("foo")).toBe(null);
  });

  test("should uri encode values", function () {
    cookies.write("foo", "bar baz%");
    expect(document.cookie).toBe("foo=bar%20baz%25");
  });
});
