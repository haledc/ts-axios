import axios, { AxiosAdapter } from "../src";

describe("adapter", () => {
  it("should support custom adapter", (done) => {
    const fn = jest.fn(() => new Promise(() => {})) as AxiosAdapter;

    axios("/foo", {
      adapter: fn,
    });

    setTimeout(() => {
      expect(fn).toHaveBeenCalled();
      done();
    }, 100);
  });
});
