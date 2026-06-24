import { getHighlighted } from "../AbletonPush2";

describe("Utilities tests", () => {
  test("creates css to dim every non-highlighted component", () => {
    const result = getHighlighted(["Setup", "Delete", "Shift"]);

    expect(result).toContain(":not(Setup)");
    expect(result).toContain(":not(Delete)");
    expect(result).toContain(":not(Shift)");
    expect(result).toContain("opacity: 0.2");
  });
});
