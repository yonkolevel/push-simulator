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
  Teal = "#00D2BE",
  Yellow = "#FED134",
  LightYellow = "#FBFFA7",
  Purple = "#A17EFC",
  LightPurple = "#B89EFD",
  Orange = "#EAA384",
  Gray = "#F3F3F3",
  Green = "#0ee60e",
  Blue = "#46A5FC",
  Red = "red",
  LightRed = "#F85F85",
  LightGreen = "#90EE90",
  BlueGreen = "#0d98ba",
  LightOrange = "#EFBAA3"
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
  123: "gray",
  7: Colors.LightRed,
  20: Colors.LightPurple,
  8: Colors.LightOrange
};
