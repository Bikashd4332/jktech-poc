import { convertBytes } from "./convertByte";

describe("convertByte", () => {
  it("should convert bytes to KB, MB, GB", () => {
    expect(convertBytes(1024)).toBe("1.0 KB");
    expect(convertBytes(1024 * 1024)).toBe("1.0 MB");
    expect(convertBytes(1024 * 1024 * 1024)).toBe("1.0 GB");
  });
});
