package push

import "testing"

func TestCreateNotePadsMapsEightByEightGrid(t *testing.T) {
	pads := createNotePads()

	seen := make(map[int]Pad)
	for _, notePads := range pads {
		for _, pad := range notePads {
			seen[pad.Pad] = pad
		}
	}

	if len(seen) != NumRows*NumCols {
		t.Fatalf("expected %d pads, got %d", NumRows*NumCols, len(seen))
	}

	first := seen[PadStartVal]
	if first.Row != 0 || first.Col != 0 {
		t.Fatalf("expected first pad at row 0 col 0, got row %d col %d", first.Row, first.Col)
	}

	lastPadID := PadStartVal + NumRows*NumCols - 1
	last := seen[lastPadID]
	if last.Row != NumRows-1 || last.Col != NumCols-1 {
		t.Fatalf("expected last pad at row %d col %d, got row %d col %d", NumRows-1, NumCols-1, last.Row, last.Col)
	}
}

func TestPadPosition(t *testing.T) {
	position := padPosition(43)

	if position.Row != 0 || position.Col != 7 {
		t.Fatalf("expected pad 43 at row 0 col 7, got row %d col %d", position.Row, position.Col)
	}
}
