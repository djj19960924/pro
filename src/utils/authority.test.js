import { getAuthority } from "./authority";

describe("getAuthority should be strong", () => {
  it("empty", () => {
    expect(getAuthority(null)).toEqual(["communityManage"]); // default value
  });
  it("string", () => {
    expect(getAuthority("communityManage")).toEqual([
      "communityManage"
    ]);
  });
  it("array with double quotes", () => {
    expect(getAuthority('"communityManage"')).toEqual([
      "communityManage"
    ]);
  });
  it("array with single item", () => {
    expect(getAuthority('["communityManage"]')).toEqual([
      "communityManage"
    ]);
  });
  it("array with multiple items", () => {
    expect(getAuthority('["communityManage", "guest"]')).toEqual([
      "communityManage",
      "guest"
    ]);
  });
});
