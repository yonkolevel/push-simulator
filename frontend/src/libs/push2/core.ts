// @ts-nocheck
import { clone, range } from 'lodash';
import { Note, PadColor } from './types';

const rootNoteColor = 126; // green
const inScaleColor = 127; // red
const defaultColor = 123; // dark gray
const pressedColor = 122;
const colorWhite = 127

const pushColorToHexMap:{[key: number]: string} = {
  126: "pink",
  127: "white",
  123: "gray"
}

export const PUSH_DEVICE_ID = [0, 33, 29];

export const notes = [
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
];

export enum Mode {
  ChordMajor,
  ChordMinor,
  Default,
  DefaultOn,
  Scale,
  Chromatic
}

export const majorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const majorScaleChords = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
export const startOctave = 3;
export const numRows = 8;
export const numCols = 8;
export const padStartVal = 36;
export const rowInterval = 5; // The start position for each row for the scale

export const inScale = note => majorScale.indexOf(note) > -1;
export const isRootNote = note => note === notes[0];
export const padKey = ({ note, octave }) => `${note}-${octave}`;
export const toMidiNote = ({ note, octave }) => `${note}${octave}`;

export const getNoteOctave = (row: number, col: number): Note => {
  const start = row * rowInterval;
  let note = start + col;
  let octave = startOctave;

  if (note >= notes.length) {
    const section = parseInt((note / notes.length).toString(), 10);
    note -= notes.length * section;
    octave += section;
  }

  return {
    note: notes[note],
    octave: octave
  };
};

const createNotePads = () => {
  const notePads = new Map();
  range(0, 8).forEach(row => {
    range(0, 8).forEach(col => {
      const { note, octave } = getNoteOctave(row, col);
      const key = `${note}-${octave}`;

      if (!notePads.has(key)) {
        notePads.set(key, []);
      }

      const pads = notePads.get(key);

      pads.push({
        row,
        col,
        pad: padStartVal + col + row * numRows
      });

      notePads.set(key, pads);
    });
  });

  return notePads;
};

export const notePads = createNotePads();

export const padPosition = (pad: number) => {
  const normPad = pad - padStartVal;
  const row = Math.round(normPad / 8);
  const col = normPad - 8 * row;
  return {
    col,
    row
  };
};

export const sortNotesToScale = (
  { note: noteA, octave: octaveA },
  { note: noteB, octave: octaveB }
) => {
  if (octaveA < octaveB) {
    return -1;
  }

  if (octaveA > octaveB) {
    return 1;
  }

  if (notes.indexOf(noteA) < notes.indexOf(noteB)) {
    return -1;
  }

  if (notes.indexOf(noteA) > notes.indexOf(noteB)) {
    return 1;
  }

  return 0;
};

// This is really basic. Only calucaltes major and minor chords
export const determineChord = chordNotes => {
  if (chordNotes.length !== 3) {
    return null;
  }
  const [root, third, fifth] = chordNotes;
  let type = 'major';

  // Create the scale with the root note of the chord as 0
  // This way we can determine the distance for the other notes to calculate the relations
  let typeNotes = clone(notes);
  const leftOver = typeNotes.splice(0, typeNotes.indexOf(root.note));
  typeNotes = typeNotes.concat(leftOver);

  if (
    Math.abs(typeNotes.indexOf(root.note) - typeNotes.indexOf(third.note)) === 3
  ) {
    type = 'minor';
  } else if (
    Math.abs(typeNotes.indexOf(root.note) - typeNotes.indexOf(third.note)) !== 4
  ) {
    return null;
  }

  if (
    Math.abs(typeNotes.indexOf(root.note) - typeNotes.indexOf(fifth.note)) !== 7
  ) {
    return null;
  }

  const roman = majorScaleChords[majorScale.indexOf(root.note)];

  return {
    roman,
    chord: root.note,
    type,
    octave: root.octave
  };
};



// only supports isomorphic - needs to handle in-key as well or write a separate func
export const getPadColor = (row: number, col: number, mode: Mode): string => {
  if (mode === Mode.DefaultOn) {
    return "white"
  }
  let padColor = defaultColor;
  const padVal = col + padStartVal + row * numCols;

  const { note } = getNoteOctave(row, col);

  if (inScale(note)) {
    padColor = inScaleColor;
  }

  if (isRootNote(note)) {
    padColor = rootNoteColor;
  }

  return pushColorToHexMap[padColor]
};

export const getPadValue = (row: number, col: number) =>   col + padStartVal + row * numCols;
