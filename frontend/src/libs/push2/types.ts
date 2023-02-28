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
  PRESSED = Color.GREEN
}

export enum Notes {
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
}

export type Note = {
  note: string;
  octave: number;
};


export interface NoteState {
  isOn: boolean;
}