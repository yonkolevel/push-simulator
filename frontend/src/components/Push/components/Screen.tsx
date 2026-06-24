import * as React from 'react';
import { EventsOff, EventsOn } from '../../../../wailsjs/runtime/runtime';
import { useAppState } from '../../../libs/push2/context/PushContext';
import { Mode } from '../../../libs/push2/core';


type DisplayFrameEvent = {
  width: number;
  height: number;
  rowStride: number;
  encodedBase64: string;
};

const PUSH_XOR_PATTERN = [0xE7, 0xF3, 0xE7, 0xFF];

const decodeBase64 = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const decodePushFrameToImageData = (frame: DisplayFrameEvent) => {
  const encoded = decodeBase64(frame.encodedBase64);
  const imageData = new ImageData(frame.width, frame.height);
  const rgba = imageData.data;

  for (let y = 0; y < frame.height; y += 1) {
    const sourceRow = y * frame.rowStride;
    const destRow = y * frame.width * 4;

    for (let x = 0; x < frame.width; x += 1) {
      const sourceOffset = sourceRow + x * 2;
      const byte0 = encoded[sourceOffset] ^ PUSH_XOR_PATTERN[(x * 2) & 3];
      const byte1 = encoded[sourceOffset + 1] ^ PUSH_XOR_PATTERN[(x * 2 + 1) & 3];
      const bgr565 = byte0 | (byte1 << 8);

      const r5 = bgr565 & 0x1f;
      const g6 = (bgr565 >> 5) & 0x3f;
      const b5 = (bgr565 >> 11) & 0x1f;

      const destOffset = destRow + x * 4;
      rgba[destOffset] = (r5 << 3) | (r5 >> 2);
      rgba[destOffset + 1] = (g6 << 2) | (g6 >> 4);
      rgba[destOffset + 2] = (b5 << 3) | (b5 >> 2);
      rgba[destOffset + 3] = 255;
    }
  }

  return imageData;
};

const formatTapMode = (mode: Mode) => {
  switch (mode) {
    case Mode.MultiTap:
      return 'LATCH';
    case Mode.ChordMajor:
      return 'CHORD';
    case Mode.Chromatic:
      return 'CHROMATIC';
    case Mode.Scale:
      return 'SCALE';
    default:
      return 'LIVE PORT';
  }
};

const formatMidiEvent = (
  event: ReturnType<typeof useAppState>['lastMidiEvent']
) => {
  if (!event) {
    return 'Waiting for MIDI';
  }

  const value = event.value === undefined ? '' : ` / ${event.value}`;
  const velocity = event.velocity === undefined ? '' : ` / ${event.velocity}`;
  const channel = event.channel === undefined ? '' : ` CH ${event.channel}`;
  const direction = event.direction === 'sent' ? 'OUT' : 'IN';
  const id = event.type === 'pitch_bend' ? '' : ` ${event.id}`;
  return `${direction} ${event.type.replace('_', ' ').toUpperCase()}${id}${velocity}${value}${channel}`;
};

const SvgScreen = (props: React.SVGProps<SVGSVGElement>) => {
  const { notesPressed, controlsPressed, tapMode, lastMidiEvent, midiChannel, displayFeedEnabled } = useAppState();
  const renderCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [displayFrameHref, setDisplayFrameHref] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!displayFeedEnabled) {
      setDisplayFrameHref(null);
      return;
    }

    EventsOn('display_frame', (frame: DisplayFrameEvent) => {
      const canvas = renderCanvasRef.current ?? document.createElement('canvas');
      renderCanvasRef.current = canvas;
      canvas.width = frame.width;
      canvas.height = frame.height;

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.putImageData(decodePushFrameToImageData(frame), 0, 0);
      setDisplayFrameHref(canvas.toDataURL('image/png'));
    });

    return () => {
      EventsOff('display_frame');
    };
  }, [displayFeedEnabled]);

  return (
    <g id="screen" {...props}>
      <defs>
        <linearGradient id="screenGradient" x1="76" x2="332" y1="56" y2="102">
          <stop stopColor="#0C2230" />
          <stop offset="0.5" stopColor="#123045" />
          <stop offset="1" stopColor="#0A141B" />
        </linearGradient>
        <filter id="screenGlow" x="70" y="50" width="268" height="58">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="76.61"
        y="56.91"
        width="255.71"
        height="44.6"
        rx="2.5"
        fill="url(#screenGradient)"
        stroke="#33566B"
        strokeWidth="0.8"
        filter="url(#screenGlow)"
      />
      <text x="86" y="72" fill="#BCEBFF" fontSize="5.2" fontFamily="monospace" letterSpacing="0.5">
        PUSH 2 SIMULATOR
      </text>
      <text x="86" y="88" fill="#F4FCFF" fontSize="8.2" fontFamily="monospace" fontWeight="700">
        {formatMidiEvent(lastMidiEvent)}
      </text>
      <text x="249" y="73" fill="#DDE8EC" fontSize="5" fontFamily="monospace" textAnchor="end">
        {formatTapMode(tapMode)}
      </text>
      <text x="249" y="90" fill="#9FB8C4" fontSize="5.4" fontFamily="monospace" textAnchor="end">
        CH {midiChannel} · NOTES {notesPressed.size} · CTRL {controlsPressed.size}
      </text>
      <rect x="258" y="64" width="62" height="25" rx="1.6" fill="rgba(255,255,255,0.06)" />
      <text x="289" y="75" fill="#F4FCFF" fontSize="5" fontFamily="monospace" textAnchor="middle">
        KEYBOARD
      </text>
      <text x="289" y="85" fill="#A3BBC6" fontSize="4.2" fontFamily="monospace" textAnchor="middle">
        Z-M · A-K · Q-I · 1-8
      </text>
      {displayFrameHref && (
        <image
          href={displayFrameHref}
          x="76.61"
          y="56.91"
          width="255.71"
          height="44.6"
          preserveAspectRatio="none"
          pointerEvents="none"
        />
      )}
    </g>
  );
};

export default SvgScreen;
