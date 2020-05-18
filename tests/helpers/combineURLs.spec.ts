import { combineURL } from "../../src/helpers/combineURLs";

describe("helpers::combineURL", () => {
  test("should combine URL", () => {
    expect(combineURL("https://api.github.com", "/users")).toBe("https://api.github.com/users");
  });

  test("should remove duplicate slashes", () => {
    expect(combineURL("https://api.github.com/", "/users")).toBe("https://api.github.com/users");
  });

  test("should insert missing slash", () => {
    expect(combineURL("https://api.github.com", "users")).toBe("https://api.github.com/users");
  });

  test("should not insert slash when relative url missing / empty", () => {
    expect(combineURL("https://api.github.com/users", "")).toBe("https://api.github.com/users");
  });

  test("should allow a single slash relative url ", () => {
    expect(combineURL("https://api.github.com/users", "/")).toBe("https://api.github.com/users/");
  });
});
