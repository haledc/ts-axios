import Cancel from "../../src/cancel/Cancel";

describe("Cancel", () => {
  it("returns correct result when message is not specified", function () {
    var cancel = new Cancel();
    expect(cancel.message).toBe("Cancel");
  });

  test("should returns correct result when message is specified", () => {
    const cancel = new Cancel("Operation has been canceled.");
    expect(cancel.message).toBe("Operation has been canceled.");
  });
});
