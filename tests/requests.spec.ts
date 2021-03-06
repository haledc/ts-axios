import axios, { AxiosResponse } from "../src";
import "./_boot";
import { getAjaxRequest } from "./_helper";
import { AxiosError } from "../src";

describe("requests", () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  test("should treat single string arg as url", () => {
    axios("/foo");

    return getAjaxRequest().then((request) => {
      expect(request.url).toBe("/foo");
      expect(request.method).toBe("GET");
    });
  });

  test("should treat method value as lower case string", () => {
    axios({
      url: "/foo",
      method: "POST",
    })
      .then((response) => {
        expect(response.config.method).toBe("post");
      })
      .catch((error) => console.log(error));

    return getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
      });
    });
  });

  test("should reject on network errors", () => {
    // jasmine.Ajax.uninstall();

    const resolveSpy = jest.fn((res: AxiosResponse) => res);
    const rejectSpy = jest.fn((error: AxiosError) => error);

    axios("/foo").then(resolveSpy).catch(rejectSpy).then(next, next);

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(rejectSpy).toHaveBeenCalled();
      expect(reason instanceof Error).toBe(true);
      expect((reason as AxiosError).message).toBe("Network Error");
      expect(reason.request).toEqual(expect.any(XMLHttpRequest));
      jasmine.Ajax.install();
    }
  });

  test("should reject when request timeout", (done) => {
    let err: AxiosError;

    axios("/foo", {
      timeout: 2000,
      method: "post",
    }).catch((error) => (err = error));

    getAjaxRequest()
      .then((request) => {
        // @ts-ignore
        request.eventBus.trigger("timeout");

        setTimeout(() => {
          expect(err instanceof Error).toBe(true);
          expect(err.message).toBe("Timeout of 2000 ms exceeded");
          done();
        }, 100);
      })
      .catch((error) => console.log(error));
  });

  test("should reject when validateStatus returns false", () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => res);

    const rejectSpy = jest.fn((error: AxiosError) => error);

    axios("/foo", {
      validateStatus(status) {
        return status !== 500;
      },
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
      .catch();

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(rejectSpy).toHaveBeenCalled();
      expect(reason instanceof Error).toBe(true);
      expect((reason as AxiosError).message).toBe(
        "Request failed with status code 500"
      );
      expect((reason as AxiosError).response!.status).toBe(500);
    }

    return getAjaxRequest().then((request) => {
      request.respondWith({
        status: 500,
      });
    });
  });

  test("should resolve when validateStatus returns true", () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => res);

    const rejectSpy = jest.fn((error: AxiosError) => error);

    axios("/foo", {
      validateStatus(status) {
        return status === 500;
      },
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
      .catch();

    function next(res: AxiosError | AxiosResponse) {
      expect(resolveSpy).toHaveBeenCalled();
      expect(rejectSpy).not.toHaveBeenCalled();
      expect(res.config.url).toBe("/foo");
    }

    return getAjaxRequest().then((request) => {
      request.respondWith({
        status: 500,
      });
    });
  });

  test("should return JSON when resolved", (done) => {
    let response: AxiosResponse;

    axios("/api/account/singup", {
      auth: {
        username: "",
        password: "",
      },
      method: "post",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => (response = res))
      .catch((error) => console.log(error));

    getAjaxRequest()
      .then((request) => {
        request.respondWith({
          status: 200,
          statusText: "OK",
          responseText: '{"errno":0}',
        });

        setTimeout(() => {
          expect(response.data).toEqual({ errno: 0 });
          done();
        }, 100);
      })
      .catch((error) => console.log(error));
  });

  test("should return JSON when rejecting", (done) => {
    let response: AxiosResponse;

    axios("/api/account/singup", {
      auth: {
        username: "",
        password: "",
      },
      method: "post",
      headers: {
        Accept: "application/json",
      },
    }).catch((error) => (response = error.response));

    getAjaxRequest()
      .then((request) => {
        request.respondWith({
          status: 400,
          statusText: "Bad Request",
          responseText: '{"error": "BAD USERNAME", "code": 1}',
        });

        setTimeout(() => {
          expect(typeof response.data).toEqual("object");
          expect(response.data.error).toBe("BAD USERNAME");
          expect(response.data.code).toBe(1);
          done();
        }, 100);
      })
      .catch((error) => console.log(error));
  });

  test("should supply correct response", (done) => {
    let response: AxiosResponse;

    axios("/foo")
      .then((res) => (response = res))
      .catch((error) => console.log(error));

    getAjaxRequest()
      .then((request) => {
        request.respondWith({
          status: 200,
          statusText: "OK",
          responseText: '{"foo": "bar"}',
          responseHeaders: {
            "Content-Type": "application/json",
          },
        });

        setTimeout(() => {
          expect(response.data.foo).toBe("bar");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("OK");
          expect(response.headers["content-type"]).toBe("application/json");
          done();
        }, 100);
      })
      .catch((error) => console.log(error));
  });

  test("should allow overriding Content-Type header case-insensitive", () => {
    let response: AxiosResponse;

    axios
      .post(
        "/foo",
        { prop: "value" },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => (response = res))
      .catch((error) => console.log(error));

    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders["Content-Type"]).toBe("application/json");
    });
  });

  test("should support array buffer response", (done) => {
    let response: AxiosResponse;

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2);
      const view = new Uint16Array(buff);

      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i);
      }

      return buff;
    }

    axios("/foo", {
      responseType: "arraybuffer",
    })
      .then((data) => (response = data))
      .catch((error) => console.log(error));

    getAjaxRequest()
      .then((request) => {
        request.respondWith({
          status: 200,
          response: str2ab("Hello world"),
        });

        setTimeout(() => {
          expect(response.data.byteLength).toBe(22);
          done();
        }, 100);
      })
      .catch((error) => console.log(error));
  });
});
