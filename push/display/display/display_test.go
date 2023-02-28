
package display

import (
	"testing"
)

func Test(t *testing.T) {
	display := NewAbletonPush2Display()
	err := display.Open()
	err = display.Close()

	if err != nil {
		t.Logf(err.Error())
		t.Fail()
	}
}