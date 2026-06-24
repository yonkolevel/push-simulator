package main

import (
	"encoding/base64"
	"encoding/binary"
	"io"
	"log"
	"net"
	"os"
	"strconv"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	displayFeedDefaultPort = 48484
	displayFeedEventName   = "display_frame"
	displayFeedMagic       = "PSMF" // PushOS Mirror Frame
)

type DisplayFrameEvent struct {
	Width         int     `json:"width"`
	Height        int     `json:"height"`
	RowStride     int     `json:"rowStride"`
	EncodedBase64 string  `json:"encodedBase64"`
	Timestamp     float64 `json:"timestamp"`
}

func (a *App) startDisplayFeedListener() {
	port := displayFeedDefaultPort
	if raw := os.Getenv("PUSH_SIM_DISPLAY_FEED_PORT"); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil && parsed > 0 && parsed <= 65535 {
			port = parsed
		}
	}

	listener, err := net.Listen("tcp", "127.0.0.1:"+strconv.Itoa(port))
	if err != nil {
		log.Printf("display feed: disabled, could not listen on 127.0.0.1:%d: %v", port, err)
		return
	}

	log.Printf("display feed: listening on 127.0.0.1:%d", port)

	go func() {
		for {
			conn, err := listener.Accept()
			if err != nil {
				log.Printf("display feed: accept failed: %v", err)
				return
			}
			go a.handleDisplayFeedConnection(conn)
		}
	}()
}

func (a *App) handleDisplayFeedConnection(conn net.Conn) {
	defer conn.Close()
	log.Printf("display feed: connected from %s", conn.RemoteAddr())

	for {
		header := make([]byte, 8)
		if _, err := io.ReadFull(conn, header); err != nil {
			if err != io.EOF && err != io.ErrUnexpectedEOF {
				log.Printf("display feed: read header failed: %v", err)
			}
			return
		}

		if string(header[:4]) != displayFeedMagic {
			log.Printf("display feed: invalid frame magic %q", string(header[:4]))
			return
		}

		frameLength := int(binary.BigEndian.Uint32(header[4:8]))
		if frameLength <= 0 || frameLength > 4*1024*1024 {
			log.Printf("display feed: invalid frame length %d", frameLength)
			return
		}

		payload := make([]byte, frameLength)
		if _, err := io.ReadFull(conn, payload); err != nil {
			log.Printf("display feed: read frame failed: %v", err)
			return
		}

		runtime.EventsEmit(a.ctx, displayFeedEventName, DisplayFrameEvent{
			Width:         960,
			Height:        160,
			RowStride:     2048,
			EncodedBase64: base64.StdEncoding.EncodeToString(payload),
		})
	}
}
