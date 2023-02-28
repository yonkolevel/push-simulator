export const createControlsArray = (
  start: number,
  end: number,
  type: ControlType
): Control[] => {
  let arr = [];
  while (start <= end) {
    const c: Control = {
      id: start,
      name: `${type}_${start}`,
      type: type
    };
    arr.push(c);
    start = start + 1;
  }

  return arr;
};

export enum ControlType {
  CC = 'cc',
  NOTE = 'note'
}

export interface Control {
  name: string;
  type: ControlType;
  /**
   * Number of the note or control
   */
  id: number;
}

export enum ControlId {
  // soft buttons
  SB1 = 20,
  SB2 = 21,
  SB3 = 22,
  SB4 = 23,
  SB5 = 24,
  SB6 = 25,
  SB7 = 26,
  SB8 = 27,
  SB9 = 102,
  SB10 = 103,
  SB11 = 104,
  SB12 = 105,
  SB13 = 106,
  SB14 = 107,
  SB15 = 108,
  SB16 = 109,
  //   left side
  TAP_TEMPO = 3,
  METRO_NOME = 9,
  DELETE = 118,
  UNDO = 119,
  MUTE = 60,
  SOLO = 61,
  STOP = 29,
  CONVERT = 35,
  DOUBLE_LOOP = 117,
  QUANTIZE = 116,
  DUPLICATE = 88,
  NEW = 87,
  FIXED_LENGTH = 90,
  AUTOMATE = 89,
  RECORD = 86,
  PLAY = 85,
  TOUCH_STRIP = 12,
  //   pads
  PAD_1 = 36,
  PAD_2 = 37,
  PAD_3 = 38,
  PAD_4 = 39,
  PAD_5 = 40,
  PAD_6 = 41,
  PAD_7 = 42,
  PAD_8 = 43,
  PAD_9 = 44,
  PAD_10 = 45,
  PAD_11 = 46,
  PAD_12 = 47,
  PAD_13 = 48,
  PAD_14 = 49,
  PAD_15 = 50,
  PAD_16 = 51,
  PAD_17 = 52,
  PAD_18 = 53,
  PAD_19 = 54,
  PAD_20 = 55,
  PAD_21 = 56,
  PAD_22 = 57,
  PAD_23 = 58,
  PAD_24 = 59,
  PAD_25 = 60,
  PAD_26 = 61,
  PAD_27 = 62,
  PAD_28 = 63,
  PAD_29 = 64,
  PAD_30 = 65,
  PAD_31 = 66,
  PAD_32 = 67,
  PAD_33 = 68,
  PAD_34 = 69,
  PAD_35 = 70,
  PAD_36 = 71,
  PAD_37 = 72,
  PAD_38 = 73,
  PAD_39 = 74,
  PAD_40 = 75,
  PAD_41 = 76,
  PAD_42 = 77,
  PAD_43 = 78,
  PAD_44 = 79,
  PAD_45 = 80,
  PAD_46 = 81,
  PAD_47 = 82,
  PAD_48 = 83,
  PAD_49 = 84,
  PAD_50 = 85,
  PAD_51 = 86,
  PAD_52 = 87,
  PAD_53 = 88,
  PAD_54 = 89,
  PAD_55 = 90,
  PAD_56 = 91,
  PAD_57 = 92,
  PAD_58 = 93,
  PAD_59 = 94,
  PAD_60 = 95,
  PAD_61 = 96,
  PAD_62 = 97,
  PAD_63 = 98,
  PAD_64 = 99,

  //   knobs
  TEMPO_KNOB = 14,
  SWING_KNOB = 15,
  MASTER_OUTPUT_KNOB = 79,
  KNOB_1 = 71,
  KNOB_2 = 72,
  KNOB_3 = 73,
  KNOB_4 = 74,
  KNOB_5 = 75,
  KNOB_6 = 76,
  KNOB_7 = 77,
  KNOB_8 = 78,
  //   right side
  SETUP = 30,
  USER = 59,
  ADD_DEVICE = 52,
  ADD_TRACK = 54,
  DEVICE = 110,
  BROWSE = 111,
  MIX = 112,
  CLIP = 113,
  MASTER = 28,
  REPEAT = 56,
  ACCENT = 57,
  SCALE = 58,
  LAYOUT = 31,
  NOTE = 50,
  SESSION = 51,
  ARROW_UP = 46,
  ARROW_DOWN = 47,
  ARROW_LEFT = 44,
  ARROW_RIGHT = 45,
  OCTAVE_UP = 55,
  OCTAVE_DOWN = 54,
  PAGE_LEFT = 62,
  PAGE_RIGHT = 63,
  SHIFT = 49,
  SELECT = 48,
  GRID_DIVISION_1 = 36,
  GRID_DIVISION_2 = 37,
  GRID_DIVISION_3 = 38,
  GRID_DIVISION_4 = 39,
  GRID_DIVISION_5 = 40,
  GRID_DIVISION_6 = 41,
  GRID_DIVISION_7 = 42,
  GRID_DIVISION_8 = 43
}

// // soft button controls
// const SB1: Control = { id: 1, name: "", type: ControlType.CC };
// const SB2: Control = { id: 1, name: "", type: ControlType.CC };
// const SB3: Control = { id: 1, name: "", type: ControlType.CC };
// const SB4: Control = { id: 1, name: "", type: ControlType.CC };
// const SB5: Control = { id: 1, name: "", type: ControlType.CC };
// const SB6: Control = { id: 1, name: "", type: ControlType.CC };
// const SB7: Control = { id: 1, name: "", type: ControlType.CC };
// const SB8: Control = { id: 1, name: "", type: ControlType.CC };
// const SB9: Control = { id: 1, name: "", type: ControlType.CC };
// const SB10: Control = { id: 1, name: "", type: ControlType.CC };
// const SB11: Control = { id: 1, name: "", type: ControlType.CC };
// const SB12: Control = { id: 1, name: "", type: ControlType.CC };
// const SB13: Control = { id: 1, name: "", type: ControlType.CC };
// const SB14: Control = { id: 1, name: "", type: ControlType.CC };
// const SB15: Control = { id: 1, name: "", type: ControlType.CC };
// const SB16: Control = { id: 1, name: "", type: ControlType.CC };

// // left side controls
// export const TAP_TEMPO: Control = {};
// export const METRO_NOME: Control = {};
// export const DELETE: Control = {};
// export const UNDO: Control = {};
// export const MUTE: Control = {};
// export const SOLO: Control = {};
// export const STOP: Control = {};
// export const CONVERT: Control = {};
// export const DOUBLE_LOOP: Control = {};
// export const QUANTIZE: Control = {};
// export const DUPLICATE: Control = {};
// export const NEW: Control = {};
// export const FIXED_LENGTH: Control = {};
// export const AUTOMATE: Control = {};
// export const RECORD: Control = {};
// export const PLAY: Control = {};
// export const TOUCH_STRIP: Control = {};

// right side controls

export const controls: Control[] = createControlsArray(1, 127, ControlType.CC);
