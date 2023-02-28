enum Color {
  RED = 127,
  GREEN = 126,
  BLUE = 125,
  LIGHTGRAY = 124,
  DARKGRAY = 123,
  WHITE = 122,
  LIGHTPURPLE = 20,
  PURPLE = 18,
  GREENBLUE = 16,
  TEA = 12,
  LIMEGREEN = 7,
  YELLOW = 3
}

export enum ButtonColor {
  RED = 127,
  GREEN = 126,
  BLUE = 125,
  LIGHTGRAY = 124,
  DARKGRAY = 123,
  WHITE = 122,
  LIGHTPURPLE = 20,
  PURPLE = 18,
  GREENBLUE = 16,
  TEA = 12,
  LIMEGREEN = 7,
  YELLOW = 3
}

export enum PadColor {
  ROOT_NOTE = Color.PURPLE,
  IN_SCALE = Color.WHITE,
  DEFAULT = 0,
  PRESSED = Color.GREENBLUE
}

export enum Notes {
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
}

export type Note = {
  note: string;
  octave: number;
};

export interface NoteState {
  isOn: boolean;
}

// a function that maps veloity to a PadColor
export const velocityToHexColor = (velocity: number): string => {
  switch (velocity) {
    case Color.WHITE:
      return "#fff";
    case Color.GREENBLUE:
      return "#DAF7A6";
    case Color.DARKGRAY:
      return "#a9a9a9";
    case Color.LIGHTGRAY:
      return "#a9a9a9";
    default:
      break;
  }

  return "#fff";
};
