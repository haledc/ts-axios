import axios from "../src";
import "./_boot";
import { getAjaxRequest } from "./_helper";

describe("auth", () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  test("should accept HTTP Basic auth with username/password", () => {
    axios("/foo", {
      auth: {
        username: "Aladdin",
        password: "open sesame",
      },
    });

    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders["Authorization"]).toBe("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
    });
  });

  test("should fail to encode HTTP Basic auth credentials with non-latin1 characters", () => {
    return axios("/foo", {
      auth: {
        username: "Aladßç£☃din",
        password: "open sesame",
      },
    })
      .then(() => {
        throw new Error(
          "should not succeed to make a HTTP Basic auth request with non-latin1 chars in credentials"
        );
      })
      .catch((error) => {
        expect(/characters/i.test(error.message)).toBe(true);
      });
  });
});
