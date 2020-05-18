import { buildFullPath } from "../../src/helpers/buildFullPath";

describe("helpers::buildFullPath", () => {
  test("should combine URLs when the requestedURL is relative", () => {
    expect(buildFullPath("https://api.github.com", "/users")).toBe("https://api.github.com/users");
  });

  test("should return the requestedURL when it is absolute", () => {
    expect(buildFullPath("https://api.github.com", "https://api.example.com/users")).toBe(
      "https://api.example.com/users"
    );
  });

  test("should combine URLs when the baseURL and requestedURL are relative", () => {
    expect(buildFullPath("/api", "/users")).toBe("/api/users");
  });
});
