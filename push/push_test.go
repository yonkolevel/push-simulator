package push

import (
	"context"
	"sync"
	"testing"
)

func TestPushReceivesMessages(t *testing.T) {
	ap := NewAbletonPush()
	ctx := context.Background()
	ap.Startup(ctx)
	ok := false
	ap.SendNoteOn(55, 100)
	g := sync.WaitGroup{}
	g.Add(1)
	g.Wait()
	// ap.on.EventsOn("note_on", func(optionalData ...interface{}) {
	// 	println("all good")
	// 	ok = true
	// 	g.Done()
	// })

	if !ok {
		t.Error("Did not write middi message")
	}
}
