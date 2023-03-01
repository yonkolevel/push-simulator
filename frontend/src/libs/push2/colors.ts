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
  yellow: 3
};

export enum Colors {
  Teal = "#00D2BE",
  Yellow = "#FED134",
  LightYellow = "#FBFFA7",
  Purple = "#B1C5FF",
  Orange = "#FF764D",
  Gray = "#F3F3F3",
  Green = "#0ee60e",
  Blue = "#6DCBFF",
  Red = "red",
  LightGreen = "#90EE90",
  BlueGreen = "#0d98ba"
}

export const pushColorToHexMap: { [key: number]: string } = {
  0: Colors.Gray,
  9: Colors.Orange,
  15: Colors.LightGreen,
  16: Colors.Teal,
  18: Colors.Purple,
  125: Colors.Blue,
  126: Colors.Green,
  127: Colors.Red,
  122: Colors.Gray,
  123: "gray"
};
