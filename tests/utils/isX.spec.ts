import {
  isArray,
  isBuffer,
  isArrayBuffer,
  isArrayBufferView,
  isFormData,
  isBlob,
  isString,
  isNumber,
  isUndefined,
  isObject,
  isDate,
  isFunction,
  isURLSearchParams,
  isStream,
} from "../../src/utils";

describe("utils::isX", () => {
  it("should validate Array", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({ length: 5 })).toBe(false);
  });

  it("should validate Buffer", () => {
    expect(isBuffer(Buffer.from("a"))).toBe(true);
    expect(isBuffer(null)).toBe(false);
    expect(isBuffer(undefined)).toBe(false);
  });

  it("should validate ArrayBuffer", () => {
    expect(isArrayBuffer(new ArrayBuffer(2))).toBe(true);
    expect(isArrayBuffer({})).toBe(false);
  });

  it("should validate ArrayBufferView", () => {
    expect(isArrayBufferView(new DataView(new ArrayBuffer(2)))).toBe(true);
  });

  it("should validate FormData", () => {
    expect(isFormData(new FormData())).toBe(true);
  });

  it("should validate Blob", () => {
    expect(isBlob(new Blob())).toBe(true);
  });

  it("should validate String", () => {
    expect(isString("")).toBe(true);
    expect(
      isString({
        toString: () => {
          return "";
        },
      })
    ).toBe(false);
  });

  it("should validate Number", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber("123")).toBe(false);
  });

  it("should validate Undefined", () => {
    expect(isUndefined(null)).toBe(false);
  });

  it("should validate Object", () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
  });

  it("should validate Date", () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(Date.now())).toBe(false);
  });

  it("should validate Function", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction("function")).toBe(false);
  });

  it("should validate Stream", () => {
    // TODO  jsdom env test node Stream module ???
    // expect(isStream(new Stream.Readable())).toBe(true)
    expect(isStream({ foo: "bar" })).toBe(false);
  });

  it("should validate URLSearchParams", () => {
    expect(isURLSearchParams(new URLSearchParams())).toBe(true);
    expect(isURLSearchParams("foo=1&bar=2")).toBe(false);
  });
});
