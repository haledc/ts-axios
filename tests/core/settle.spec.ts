import { settle } from "../../src/core/settle";

describe("core::settle", () => {
  let resolve: jest.Mock<any, any>;
  let reject: jest.Mock<any, any>;

  beforeEach(() => {
    resolve = jest.fn();
    reject = jest.fn();
  });

  test("should resolve promise if status is not set", () => {
    const response = {
      config: {
        validateStatus: () => {
          return true;
        },
      },
    };
    settle(resolve, reject, response);
    expect(resolve).toHaveBeenCalledWith(response);
    expect(reject).not.toHaveBeenCalled();
  });

  test("should resolve promise if validateStatus is not set", () => {
    const response = {
      status: 500,
      config: {},
    };
    settle(resolve, reject, response);
    expect(resolve).toHaveBeenCalledWith(response);
    expect(reject).not.toHaveBeenCalled();
  });

  test("should resolve promise if validateStatus returns true", () => {
    const response = {
      status: 500,
      config: {
        validateStatus: () => {
          return true;
        },
      },
    };
    settle(resolve, reject, response);
    expect(resolve).toHaveBeenCalledWith(response);
    expect(reject).not.toHaveBeenCalled();
  });

  test("should reject promise if validateStatus returns false", () => {
    const req = {
      path: "/foo",
    };
    const response = {
      status: 500,
      config: {
        validateStatus: () => {
          return false;
        },
      },
      request: req,
    };
    settle(resolve, reject, response);
    expect(resolve).not.toHaveBeenCalled();
    expect(reject).toHaveBeenCalled();
    const reason = reject.mock.calls[0][0];
    expect(reason instanceof Error).toBe(true);
    expect(reason.message).toBe("Request failed with status code 500");
    expect(reason.config).toBe(response.config);
    expect(reason.request).toBe(req);
    expect(reason.response).toBe(response);
  });

  test("should pass status to validateStatus", () => {
    const validateStatus = jasmine.createSpy("validateStatus");
    const response = {
      status: 500,
      config: {
        validateStatus: validateStatus,
      },
    };
    settle(resolve, reject, response);
    expect(validateStatus).toHaveBeenCalledWith(500);
  });
});
