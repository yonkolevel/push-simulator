export const buttonColors = {
  red: 127,
  green: 126,
  lightGreen: 15,
  blue: 125,
  lightgray: 124,
  darkgray: 123,
  white: 122,
  lightpurple: 20,
  purple: 18,
  greenblue: 16,
  teal: 12,
  limegreen: 7,
  yellow: 3,
  lightOrange: 8
};

export enum Colors {
  Teal = "#00B7C7",
  Yellow = "#FFD426",
  LightYellow = "#FFF27A",
  Purple = "#B65CFF",
  LightPurple = "#D19BFF",
  Orange = "#FF8A00",
  Gray = "#E7E5DC",
  Green = "#56D33B",
  Blue = "#00A7FF",
  Red = "#FF2D2A",
  LightRed = "#FF6B5F",
  LightGreen = "#9AF27D",
  BlueGreen = "#00C8A8",
  LightOrange = "#FFB24A"
}

export const PushPalette = {
  page: "#080807",
  pageGlow: "#171713",
  body: "#1D1D1B",
  bodyEdge: "#0C0C0B",
  panel: "rgba(17, 17, 15, 0.9)",
  panelBorder: "rgba(255, 255, 255, 0.14)",
  control: "#3C3C3B",
  controlLit: "#E7E5DC",
  label: "#F2F1EA",
  labelMuted: "#8B8B84",
  display: "#10252F",
  displayText: "#BCEBFF",
  accent: Colors.Yellow,
  sent: Colors.Orange,
  received: Colors.Blue,
};

export const pushColorToHexMap: { [key: number]: string } = {
  0: "#242625",
  9: Colors.Orange,
  15: Colors.LightGreen,
  16: Colors.Teal,
  18: Colors.Purple,
  125: Colors.Blue,
  126: Colors.Green,
  127: Colors.Red,
  122: Colors.Gray,
  123: "#3C3C3B",
  7: Colors.LightRed,
  20: Colors.LightPurple,
  8: Colors.LightOrange
};
