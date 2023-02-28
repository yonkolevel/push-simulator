import { ControlType, createControlsArray } from "../controls";

describe("Controls tests", () => {
  test("Creates controls array", () => {
    const expected = [
      { id: 20, name: "cc_20", type: "cc" },
      { id: 21, name: "cc_21", type: "cc" },
      { id: 22, name: "cc_22", type: "cc" },
      { id: 23, name: "cc_23", type: "cc" },
      { id: 24, name: "cc_24", type: "cc" },
      { id: 25, name: "cc_25", type: "cc" },
      { id: 26, name: "cc_26", type: "cc" },
      { id: 27, name: "cc_27", type: "cc" }
    ];

    const controls = createControlsArray(20, 27, ControlType.CC);
    expect(controls).toEqual(expected);
  });
});
