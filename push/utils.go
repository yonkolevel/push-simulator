package push

import (
	"fmt"
	"math"
	"sort"
)

const DEVICE_NAME = "Ableton Push 2 Simulator"

type Note struct {
	note   string
	octave int
}

type Pad struct {
	Row int
	Col int
	Pad int
}

var Notes = []string{
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
	"B",
}

type NotePads map[string][]Pad

var MajorScale = []string{"C", "D", "E", "F", "G", "A", "B"}

var MajorScaleChords = []string{"I", "ii", "iii", "IV", "V", "vi", "vii"}

const StartOctave = 3
const NumRows = 8
const NumCols = 8
const PadStartVal = 36
const RowInterval = 5 // The start position for each row for the scale

func inScale(note string) bool {
	return index(MajorScale, note) > -1
}

func isRootNote(note string) bool { return note == Notes[0] }

func padKey(note string, octave int) string {
	return fmt.Sprintf("%s-%d", note, octave)
}

func toMidiNote(note, octave int) string {
	return fmt.Sprintf("%d%d", note, octave)
}

func getNoteOctave(row int, col int) Note {
	var start = row * RowInterval
	var note = start + col
	var octave = StartOctave

	if note >= len(Notes) {
		// note = 12 -> 12 - 12 * (12 / 12)
		// note = 25 -> 25 - 12 * (25 / 12)
		var section = note / len(Notes)
		note -= len(Notes) * section
		octave += section
	}

	return Note{
		note:   Notes[note],
		octave: octave,
	}
}

func createNotePads() NotePads {
	var notePads = make(NotePads)

	for col := 1; col <= 10; col++ {
		for row := 1; row <= 10; row++ {
			note := getNoteOctave(row, col)
			key := padKey(note.note, note.octave)

			if _, ok := notePads[key]; !ok {
				notePads[key] = []Pad{}
			}

			pads := notePads[key]
			p := Pad{
				Row: row,
				Col: col,
				Pad: (PadStartVal + col + row*NumRows),
			}

			pads = append(pads, p)

			notePads[key] = pads
		}
	}

	return notePads
}

func index(slice []string, item string) int {
	for i := range slice {
		if slice[i] == item {
			return i
		}
	}
	return -1
}

func sortNotesToScale(notes []Note) []Note {
	sort.SliceStable(notes, func(a, b int) bool {
		if notes[a].octave < notes[b].octave {
			return false
		}

		if notes[b].octave > notes[b].octave {
			return true
		}

		if a < b {
			return false
		}

		if a > b {
			return true
		}

		return false
	})

	return notes
}

func determineChord(chordNotes []Note) *Chord {
	if len(chordNotes) != 3 {
		return nil
	}

	root := chordNotes[0]
	third := chordNotes[1]
	fifth := chordNotes[2]
	cType := "major"

	// Create the scale with the root note of the chord as 0
	// This way we can determine the distance for the other notes to calculate the relations
	typeNotes := Notes

	leftOver := Notes[0:index(Notes, root.note)]
	typeNotes = append(typeNotes, leftOver...)

	if math.Abs(float64(index(typeNotes, root.note)-index(typeNotes, third.note))) == 3 {
		cType = "minor"
	} else if math.Abs(float64(index(typeNotes, root.note)-index(typeNotes, third.note))) != 4 {
		return nil
	}

	if math.Abs(float64(index(typeNotes, root.note)-index(typeNotes, fifth.note))) != 7 {
		return nil
	}

	roman := MajorScaleChords[index(MajorScale, root.note)]

	return &Chord{
		Roman:  roman,
		Chord:  root.note,
		Type:   cType,
		Octave: root.octave,
	}
}

type Chord struct {
	Roman  string
	Chord  string
	Type   string
	Octave int
}

func padPosition(pad int) Pad {
	normPad := pad - PadStartVal
	row := normPad / 8
	col := normPad - (8 * row)
	return Pad{
		Pad: pad,
		Row: row,
		Col: col,
	}
}
