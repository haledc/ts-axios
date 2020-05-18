import { parseHeaders } from "../../src/helpers/parseHeaders";

describe("helpers::parseHeaders", () => {
  test("should parse headers", () => {
    const parsed = parseHeaders(
      "Content-Type: application/json\r\n" +
        "Connection: keep-alive\r\n" +
        "Transfer-Encoding: chunked\r\n" +
        "Date: Tue, 21 May 2019 09:23:44 GMT\r\n" +
        ":aa\r\n" +
        "key:"
    );

    expect(parsed["content-type"]).toBe("application/json");
    expect(parsed["connection"]).toBe("keep-alive");
    expect(parsed["transfer-encoding"]).toBe("chunked");
    expect(parsed["date"]).toBe("Tue, 21 May 2019 09:23:44 GMT");
    expect(parsed[":aa"]).toBe(undefined);
    expect(parsed["key"]).toBe("");
  });

  test("should return empty object if headers is empty string", () => {
    expect(parseHeaders("")).toEqual({});
  });

  test("should use array for set-cookie", function () {
    const parsedZero = parseHeaders("");
    const parsedSingle = parseHeaders("Set-Cookie: key=val;");
    const parsedMulti = parseHeaders("Set-Cookie: key=val;\n" + "Set-Cookie: key2=val2;\n");

    expect(parsedZero["set-cookie"]).toBe(undefined);
    expect(parsedSingle["set-cookie"]).toEqual(["key=val;"]);
    expect(parsedMulti["set-cookie"]).toEqual(["key=val;", "key2=val2;"]);
  });

  test("should handle duplicates", function () {
    const parsed = parseHeaders(
      "Age: age-a\n" + // age is in ignore duplicates blacklist
        "Age: age-b\n" +
        "Foo: foo-a\n" +
        "Foo: foo-b\n"
    );

    expect(parsed["age"]).toBe("age-a");
    expect(parsed["foo"]).toBe("foo-a, foo-b");
  });
});
