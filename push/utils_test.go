package push

import (
	"fmt"
	"testing"
)

func TestCreateNotePads(t *testing.T) {
	pads := createNotePads()
	expected := "map[A#-3:[{1 5 49}] A#-4:[{4 2 70} {3 7 67}] A#-5:[{6 4 88} {5 9 85}] A#-6:[{9 1 109} {8 6 106}] A#-7:[{10 8 124}] A-3:[{1 4 48}] A-4:[{4 1 69} {3 6 66}] A-5:[{6 3 87} {5 8 84}] A-6:[{8 5 105} {7 10 102}] A-7:[{10 7 123}] B-3:[{2 1 53} {1 6 50}] B-4:[{4 3 71} {3 8 68}] B-5:[{6 5 89} {5 10 86}] B-6:[{9 2 110} {8 7 107}] B-7:[{10 9 125}] C#-4:[{2 3 55} {1 8 52}] C#-5:[{4 5 73} {3 10 70}] C#-6:[{7 2 94} {6 7 91}] C#-7:[{9 4 112} {8 9 109}] C-4:[{2 2 54} {1 7 51}] C-5:[{4 4 72} {3 9 69}] C-6:[{7 1 93} {6 6 90}] C-7:[{9 3 111} {8 8 108}] C-8:[{10 10 126}] D#-4:[{2 5 57} {1 10 54}] D#-5:[{5 2 78} {4 7 75}] D#-6:[{7 4 96} {6 9 93}] D#-7:[{10 1 117} {9 6 114}] D-4:[{2 4 56} {1 9 53}] D-5:[{5 1 77} {4 6 74}] D-6:[{7 3 95} {6 8 92}] D-7:[{9 5 113} {8 10 110}] E-4:[{3 1 61} {2 6 58}] E-5:[{5 3 79} {4 8 76}] E-6:[{7 5 97} {6 10 94}] E-7:[{10 2 118} {9 7 115}] F#-3:[{1 1 45}] F#-4:[{3 3 63} {2 8 60}] F#-5:[{5 5 81} {4 10 78}] F#-6:[{8 2 102} {7 7 99}] F#-7:[{10 4 120} {9 9 117}] F-4:[{3 2 62} {2 7 59}] F-5:[{5 4 80} {4 9 77}] F-6:[{8 1 101} {7 6 98}] F-7:[{10 3 119} {9 8 116}] G#-3:[{1 3 47}] G#-4:[{3 5 65} {2 10 62}] G#-5:[{6 2 86} {5 7 83}] G#-6:[{8 4 104} {7 9 101}] G#-7:[{10 6 122}] G-3:[{1 2 46}] G-4:[{3 4 64} {2 9 61}] G-5:[{6 1 85} {5 6 82}] G-6:[{8 3 103} {7 8 100}] G-7:[{10 5 121} {9 10 118}]]"
	result := fmt.Sprint(pads)

	if expected != result {
		t.Error("pads not created correctly")
	}
}
