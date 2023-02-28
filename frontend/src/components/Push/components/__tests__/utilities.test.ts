import { getHighlighted } from "../AbletonPush2";

describe("Utilities tests", () => {
  test("It creates correct css to highlight components", () => {
    const result = getHighlighted(["Setup", "Delete", "Shift"]);
    console.log(result);
  });
});
