package main

import (
	"push-simulator/push/display/display"
)

func main () {
	pd:=display.NewAbletonPush2Display()
	pd.Open()
}