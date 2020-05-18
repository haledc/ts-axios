import axios from "../src";
import "./_boot";
import { getAjaxRequest } from "./_helper";

function testHeaderValue(headers: any, key: string, val?: string): void {
  let hasFound = false;

  for (let k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      hasFound = true;
      expect(headers[k]).toBe(val);
      break;
    }
  }

  if (!hasFound) {
    if (typeof val === "undefined") {
      expect(headers.hasOwnProperty(key)).toBe(false);
    } else {
      throw new Error(key + " was not found in header");
    }
  }
}

describe("headers", () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  test("should use default common headers", () => {
    const headers = axios.defaults.headers.common;

    axios("/foo");

    return getAjaxRequest().then((request) => {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(headers[key]);
        }
      }
    });
  });

  test("should add extra headers for post", () => {
    axios.post("/foo", "fizz=buzz");

    return getAjaxRequest().then((request) => {
      testHeaderValue(request.requestHeaders, "Content-Type", "application/x-www-form-urlencoded");
    });
  });

  test("should use application/json when posting an object", () => {
    axios.post("/foo/bar", {
      firstName: "foo",
      lastName: "bar",
    });

    return getAjaxRequest().then((request) => {
      testHeaderValue(request.requestHeaders, "Content-Type", "application/json;charset=utf-8");
    });
  });

  test("should remove content-type if data is empty", () => {
    axios.post("/foo");

    return getAjaxRequest().then((request) => {
      testHeaderValue(request.requestHeaders, "Content-Type", undefined);
    });
  });

  test("should preserve content-type if data is false", () => {
    axios.post("/foo", false);

    return getAjaxRequest().then((request) => {
      testHeaderValue(request.requestHeaders, "Content-Type", "application/x-www-form-urlencoded");
    });
  });

  test("should remove content-type if data is FormData", () => {
    const data = new FormData();
    data.append("foo", "bar");

    axios.post("/foo", data);

    return getAjaxRequest().then((request) => {
      testHeaderValue(request.requestHeaders, "Content-Type", undefined);
    });
  });
});
