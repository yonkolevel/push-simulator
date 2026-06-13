import * as React from 'react';
import { useAppState } from '../../../libs/push2/context/PushContext';
import { Mode } from '../../../libs/push2/core';

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
  const { notesPressed, controlsPressed, tapMode, lastMidiEvent, midiChannel } = useAppState();

  return (
    <g id="screen" {...props}>
      <defs>
        <linearGradient id="screenGradient" x1="76" x2="332" y1="56" y2="102">
          <stop stopColor="#10241f" />
          <stop offset="0.5" stopColor="#172d35" />
          <stop offset="1" stopColor="#0f171d" />
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
        stroke="#284048"
        strokeWidth="0.8"
        filter="url(#screenGlow)"
      />
      <text x="86" y="72" fill="#7ee7cf" fontSize="5.2" fontFamily="monospace" letterSpacing="0.5">
        PUSH 2 SIMULATOR
      </text>
      <text x="86" y="88" fill="#eefbf7" fontSize="8.2" fontFamily="monospace" fontWeight="700">
        {formatMidiEvent(lastMidiEvent)}
      </text>
      <text x="249" y="73" fill="#c7d2dc" fontSize="5" fontFamily="monospace" textAnchor="end">
        {formatTapMode(tapMode)}
      </text>
      <text x="249" y="90" fill="#9fb2c0" fontSize="5.4" fontFamily="monospace" textAnchor="end">
        CH {midiChannel} · NOTES {notesPressed.size} · CTRL {controlsPressed.size}
      </text>
      <rect x="258" y="64" width="62" height="25" rx="1.6" fill="rgba(255,255,255,0.06)" />
      <text x="289" y="75" fill="#d6f6ec" fontSize="5" fontFamily="monospace" textAnchor="middle">
        KEYBOARD
      </text>
      <text x="289" y="85" fill="#8fa9a1" fontSize="4.2" fontFamily="monospace" textAnchor="middle">
        Z-M · A-K · Q-I · 1-8
      </text>
    </g>
  );
};

export default SvgScreen;
