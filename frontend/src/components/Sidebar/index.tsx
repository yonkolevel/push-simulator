import { useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import ScaleModeSelector from "./ScaleModeSelector";
import DeviceModeToggle from "./DeviceModeToggle";
import OctaveControl from "./OctaveControl";
import MidiStatus from "./MidiStatus";
import {
  panicAllOff,
  sendCommonCCSweep,
  sendPadSweep,
  sendPitchBend,
  sendTestCC,
  sendTestNote,
  setMidiChannel,
  setPadVelocity,
  setShowPadLabels,
  useAppDispatch,
  useAppState,
} from "../../libs/push2/context/PushContext";
import { ControlId } from "../../libs/push2/controls";

interface SidebarProps {
  onClose: () => void;
}

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
  </svg>
);

const readStoredProbeNumber = (key: string, fallback: number, min = 0, max = 127) => {
  if (typeof window === "undefined") return fallback;
  const value = Number(window.localStorage.getItem(key));
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
};

const writeStoredProbeNumber = (key: string, value: number) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, String(value));
  }
};

const TEST_NOTE_KEY = "push-simulator.testNote";
const TEST_CC_KEY = "push-simulator.testCC";
const TEST_BEND_KEY = "push-simulator.testPitchBend";
const PITCH_BEND_MIN = -8192;
const PITCH_BEND_MAX = 8191;

export default function Sidebar({ onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { padVelocity, midiChannel, showPadLabels } = useAppState();
  const [testNote, setTestNoteState] = useState(() => readStoredProbeNumber(TEST_NOTE_KEY, 60));
  const [testCC, setTestCCState] = useState(() => readStoredProbeNumber(TEST_CC_KEY, 118));
  const [testBend, setTestBendState] = useState(() =>
    readStoredProbeNumber(TEST_BEND_KEY, 4096, PITCH_BEND_MIN, PITCH_BEND_MAX)
  );

  const setTestNote = (note: number) => {
    const safeNote = Math.max(0, Math.min(127, Math.round(note)));
    writeStoredProbeNumber(TEST_NOTE_KEY, safeNote);
    setTestNoteState(safeNote);
  };

  const setTestCC = (cc: number) => {
    const safeCC = Math.max(0, Math.min(127, Math.round(cc)));
    writeStoredProbeNumber(TEST_CC_KEY, safeCC);
    setTestCCState(safeCC);
  };

  const setTestBend = (bend: number) => {
    const safeBend = Math.max(PITCH_BEND_MIN, Math.min(PITCH_BEND_MAX, Math.round(bend)));
    writeStoredProbeNumber(TEST_BEND_KEY, safeBend);
    setTestBendState(safeBend);
  };

  return (
    <Box
      w="320px"
      minW="320px"
      bg="rgba(12, 18, 28, 0.82)"
      backdropFilter="blur(18px)"
      borderLeft="1px solid"
      borderColor="whiteAlpha.200"
      p={5}
      overflowY="auto"
      boxShadow="-18px 0 40px rgba(0, 0, 0, 0.18)"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Box textAlign="left">
          <Heading size="sm" color="white">
            Performance Panel
          </Heading>
          <Text color="whiteAlpha.600" fontSize="xs" mt={1}>
            MIDI, layout, and keyboard controls
          </Text>
        </Box>
        <IconButton
          aria-label="Close settings"
          icon={<ChevronRightIcon />}
          onClick={onClose}
          variant="ghost"
          color="white"
          size="sm"
          _hover={{ bg: "whiteAlpha.200" }}
        />
      </Flex>

      <Divider borderColor="whiteAlpha.300" mb={5} />

      <VStack align="stretch" spacing={6}>
        <MidiStatus />
        <Divider borderColor="whiteAlpha.200" />
        <MidiCircuitChecklist />
        <Divider borderColor="whiteAlpha.200" />
        <DeviceModeToggle />
        <Divider borderColor="whiteAlpha.200" />
        <ScaleModeSelector />
        <Divider borderColor="whiteAlpha.200" />
        <OctaveControl />
        <Divider borderColor="whiteAlpha.200" />
        <VelocityControl
          velocity={padVelocity}
          onChange={(velocity) => setPadVelocity(dispatch, velocity)}
        />
        <ChannelControl
          channel={midiChannel}
          onChange={(channel) => setMidiChannel(dispatch, channel)}
        />
        <PadLabelToggle
          enabled={showPadLabels}
          onChange={(enabled) => setShowPadLabels(dispatch, enabled)}
        />
        <Divider borderColor="whiteAlpha.200" />
        <TestPulseControls
          note={testNote}
          cc={testCC}
          bend={testBend}
          velocity={padVelocity}
          onNoteChange={setTestNote}
          onCCChange={setTestCC}
          onBendChange={setTestBend}
          onSendNote={() => sendTestNote(dispatch, testNote as ControlId, padVelocity)}
          onSendCC={() => sendTestCC(dispatch, testCC as ControlId)}
          onSendBend={() => sendPitchBend(dispatch, testBend)}
          onCenterBend={() => {
            setTestBend(0);
            sendPitchBend(dispatch, 0);
          }}
          onSendPadSweep={(signal) => sendPadSweep(dispatch, padVelocity, signal)}
          onSendCCSweep={(signal) => sendCommonCCSweep(dispatch, signal)}
          onPanic={() => panicAllOff(dispatch)}
        />
        <Divider borderColor="whiteAlpha.200" />
        <KeyboardHint />
        <Divider borderColor="whiteAlpha.200" />
        <MidiMapReference />
      </VStack>
    </Box>
  );
}

function TestPulseControls({
  note,
  cc,
  bend,
  velocity,
  onNoteChange,
  onCCChange,
  onBendChange,
  onSendNote,
  onSendCC,
  onSendBend,
  onCenterBend,
  onSendPadSweep,
  onSendCCSweep,
  onPanic,
}: {
  note: number;
  cc: number;
  bend: number;
  velocity: number;
  onNoteChange: (note: number) => void;
  onCCChange: (cc: number) => void;
  onBendChange: (bend: number) => void;
  onSendNote: () => void;
  onSendCC: () => void;
  onSendBend: () => void;
  onCenterBend: () => void;
  onSendPadSweep: (signal: AbortSignal) => Promise<void>;
  onSendCCSweep: (signal: AbortSignal) => Promise<void>;
  onPanic: () => void;
}) {
  const [activeSweep, setActiveSweep] = useState<"pads" | "cc" | null>(null);
  const sweepAbortController = useRef<AbortController | null>(null);

  const runSweep = async (kind: "pads" | "cc", handler: (signal: AbortSignal) => Promise<void>) => {
    if (activeSweep) return;
    const controller = new AbortController();
    sweepAbortController.current = controller;
    setActiveSweep(kind);
    try {
      await handler(controller.signal);
    } finally {
      sweepAbortController.current = null;
      setActiveSweep(null);
    }
  };

  const stopSweep = () => {
    sweepAbortController.current?.abort();
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Box textAlign="left">
        <Flex justify="space-between" align="center" mb={2}>
          <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
            TEST NOTE
          </Text>
          <Text color="white" fontSize="sm" fontFamily="mono">
            {note} · vel {velocity}
          </Text>
        </Flex>
        <Slider
          min={0}
          max={127}
          step={1}
          value={note}
          onChange={onNoteChange}
          aria-label="Test note number"
          focusThumbOnChange={false}
        >
          <SliderTrack bg="whiteAlpha.200">
            <SliderFilledTrack bg="teal.300" />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
        <Button
          mt={2}
          w="100%"
          onClick={onSendNote}
          colorScheme="teal"
          variant="outline"
          size="sm"
          borderColor="teal.300"
          color="teal.100"
          _hover={{ bg: "teal.900", borderColor: "teal.200" }}
        >
          Send Note {note}
        </Button>
      </Box>

      <Box textAlign="left">
        <Flex justify="space-between" align="center" mb={2}>
          <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
            TEST CC
          </Text>
          <Text color="white" fontSize="sm" fontFamily="mono">
            {cc}
          </Text>
        </Flex>
        <Slider
          min={0}
          max={127}
          step={1}
          value={cc}
          onChange={onCCChange}
          aria-label="Test CC number"
          focusThumbOnChange={false}
        >
          <SliderTrack bg="whiteAlpha.200">
            <SliderFilledTrack bg="blue.300" />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
        <Button
          mt={2}
          w="100%"
          onClick={onSendCC}
          colorScheme="blue"
          variant="outline"
          size="sm"
          borderColor="blue.300"
          color="blue.100"
          _hover={{ bg: "blue.900", borderColor: "blue.200" }}
        >
          Send CC {cc}
        </Button>
      </Box>

      <Box textAlign="left">
        <Flex justify="space-between" align="center" mb={2}>
          <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
            TEST BEND
          </Text>
          <Text color="white" fontSize="sm" fontFamily="mono">
            {bend}
          </Text>
        </Flex>
        <Slider
          min={PITCH_BEND_MIN}
          max={PITCH_BEND_MAX}
          step={1}
          value={bend}
          onChange={onBendChange}
          aria-label="Test pitch bend value"
          focusThumbOnChange={false}
        >
          <SliderTrack bg="whiteAlpha.200">
            <SliderFilledTrack bg="purple.300" />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
        <Flex gap={2} mt={2}>
          <Button
            flex="1"
            onClick={onSendBend}
            colorScheme="purple"
            variant="outline"
            size="sm"
            borderColor="purple.300"
            color="purple.100"
            _hover={{ bg: "purple.900", borderColor: "purple.200" }}
          >
            Send Bend
          </Button>
          <Button
            onClick={onCenterBend}
            variant="ghost"
            size="sm"
            color="whiteAlpha.800"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            Center
          </Button>
        </Flex>
      </Box>

      <Box textAlign="left">
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb={2}>
          MAPPING SWEEPS
        </Text>
        <Flex gap={2}>
          <Button
            flex="1"
            onClick={() => runSweep("pads", onSendPadSweep)}
            isLoading={activeSweep === "pads"}
            isDisabled={activeSweep !== null}
            loadingText="Pads"
            colorScheme="teal"
            variant="outline"
            size="sm"
            borderColor="teal.300"
            color="teal.100"
            _hover={{ bg: "teal.900", borderColor: "teal.200" }}
          >
            Pad Sweep
          </Button>
          <Button
            flex="1"
            onClick={() => runSweep("cc", onSendCCSweep)}
            isLoading={activeSweep === "cc"}
            isDisabled={activeSweep !== null}
            loadingText="CCs"
            colorScheme="blue"
            variant="outline"
            size="sm"
            borderColor="blue.300"
            color="blue.100"
            _hover={{ bg: "blue.900", borderColor: "blue.200" }}
          >
            CC Sweep
          </Button>
        </Flex>
        {activeSweep && (
          <Button
            mt={2}
            w="100%"
            onClick={stopSweep}
            colorScheme="red"
            variant="ghost"
            size="sm"
            color="red.100"
            _hover={{ bg: "red.900" }}
          >
            Stop Sweep
          </Button>
        )}
        <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
          Walks Push pad notes 36–99 or common Push CCs so MidiCircuit can learn/verify mappings quickly. Stop cancels after the current note/CC is released.
        </Text>
      </Box>

      <Box>
        <Button
          onClick={onPanic}
          colorScheme="red"
          variant="outline"
          size="sm"
          w="100%"
          borderColor="red.300"
          color="red.100"
          _hover={{ bg: "red.900", borderColor: "red.200" }}
        >
          Panic / Reset MIDI
        </Button>
        <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
          Sends all notes/controls off and centers pitch bend.
        </Text>
      </Box>
    </VStack>
  );
}

const MIDICIRCUIT_CHECKLIST = [
  "Select Ableton Push 2 Live Port or User Port in your MIDI app.",
  "Send Test Note and confirm the app receives note + velocity on the chosen channel.",
  "Send Test CC and confirm controller value changes arrive.",
  "Run Pad Sweep / CC Sweep when learning mappings in bulk.",
  "Use Panic / Reset MIDI if anything sticks, then Copy Report if routing still looks wrong.",
];

function MidiCircuitChecklist() {
  return (
    <Box textAlign="left" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" borderRadius="lg" p={3}>
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb={2}>
        MIDICIRCUIT CHECKLIST
      </Text>
      <VStack align="stretch" spacing={2}>
        {MIDICIRCUIT_CHECKLIST.map((item, index) => (
          <Flex key={item} gap={2} align="flex-start">
            <Badge colorScheme="teal" variant="subtle" borderRadius="full" minW="18px" textAlign="center">
              {index + 1}
            </Badge>
            <Text color="whiteAlpha.700" fontSize="xs">
              {item}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

function PadLabelToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <Flex justify="space-between" align="center">
      <Box textAlign="left">
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
          PAD LABELS
        </Text>
        <Text color="whiteAlpha.500" fontSize="xs" mt={1}>
          Show note names on the 8×8 grid.
        </Text>
      </Box>
      <Switch
        isChecked={enabled}
        onChange={(event) => onChange(event.target.checked)}
        colorScheme="teal"
        aria-label="Show pad labels"
      />
    </Flex>
  );
}

function ChannelControl({
  channel,
  onChange,
}: {
  channel: number;
  onChange: (channel: number) => void;
}) {
  return (
    <Box textAlign="left">
      <Flex justify="space-between" align="center" mb={3}>
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
          MIDI CHANNEL
        </Text>
        <Text color="white" fontSize="sm" fontFamily="mono">
          CH {channel}
        </Text>
      </Flex>
      <Select
        value={channel}
        onChange={(event) => onChange(Number(event.target.value))}
        size="sm"
        color="white"
        borderColor="whiteAlpha.300"
        bg="blackAlpha.300"
        _hover={{ borderColor: "whiteAlpha.500" }}
      >
        {Array.from({ length: 16 }, (_, index) => index + 1).map((value) => (
          <option key={value} value={value} style={{ color: "black" }}>
            Channel {value}
          </option>
        ))}
      </Select>
      <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
        Applies to outgoing notes, CCs, and test pulses.
      </Text>
    </Box>
  );
}

function VelocityControl({
  velocity,
  onChange,
}: {
  velocity: number;
  onChange: (velocity: number) => void;
}) {
  return (
    <Box textAlign="left">
      <Flex justify="space-between" align="center" mb={3}>
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
          PAD VELOCITY
        </Text>
        <Text color="white" fontSize="sm" fontFamily="mono">
          {velocity}
        </Text>
      </Flex>
      <Slider
        min={1}
        max={127}
        step={1}
        value={velocity}
        onChange={onChange}
        aria-label="Pad velocity"
        focusThumbOnChange={false}
      >
        <SliderTrack bg="whiteAlpha.200">
          <SliderFilledTrack bg="teal.300" />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
      <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
        Applies to pads, keyboard input, and Test Note.
      </Text>
    </Box>
  );
}

const MIDI_MAP_TEXT = `Ableton Push 2 Simulator MIDI Map

Ports:
- Ableton Push 2 Live Port
- Ableton Push 2 User Port

Pads:
- 8x8 grid: Notes 36-99
- Bottom-left pad: Note 36
- Top-right pad: Note 99

Soft buttons:
- Top row: CC 102-109
- Bottom row: CC 20-27

Transport / left:
- Play: CC 85
- Record: CC 86
- Delete: CC 118
- Undo: CC 119
- Mute: CC 60
- Solo: CC 61
- Stop Clip: CC 29

Mode / right:
- Device: CC 110
- Mix: CC 112
- Clip: CC 113
- Scale: CC 58
- Repeat: CC 56
- Accent: CC 57

Navigation:
- Arrows: CC 44-47
- Page: CC 62-63
- Octave: CC 54-55

Use the simulator control inspector for exact IDs while hovering controls.`;

const MIDI_MAP_SECTIONS = [
  {
    title: "Pads",
    rows: ["8×8 grid: Notes 36–99", "Bottom-left pad: Note 36", "Top-right pad: Note 99"],
  },
  {
    title: "Soft buttons",
    rows: ["Top row: CC 102–109", "Bottom row: CC 20–27"],
  },
  {
    title: "Transport / left",
    rows: ["Play: CC 85", "Record: CC 86", "Delete: CC 118", "Undo: CC 119"],
  },
  {
    title: "Mode / right",
    rows: ["Device: CC 110", "Mix: CC 112", "Clip: CC 113", "Scale: CC 58"],
  },
  {
    title: "Navigation",
    rows: ["Arrows: CC 44–47", "Page: CC 62–63", "Octave: CC 54–55"],
  },
];

function MidiMapReference() {
  const toast = useToast();

  const copyMap = async () => {
    try {
      await navigator.clipboard.writeText(MIDI_MAP_TEXT);
      toast({
        title: "MIDI map copied",
        description: "Paste it into MidiCircuit notes, docs, or an issue.",
        status: "success",
        duration: 2200,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Could not copy MIDI map",
        description: "Clipboard access was denied by the webview.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box textAlign="left">
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb={3}>
        MIDI MAP QUICK REFERENCE
      </Text>
      <VStack align="stretch" spacing={3}>
        {MIDI_MAP_SECTIONS.map((section) => (
          <Box key={section.title} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" borderRadius="md" p={3}>
            <Text color="white" fontSize="xs" fontWeight="bold" mb={1}>
              {section.title}
            </Text>
            <VStack align="stretch" spacing={0.5}>
              {section.rows.map((row) => (
                <Text key={row} color="whiteAlpha.700" fontSize="xs" fontFamily="mono">
                  {row}
                </Text>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
      <Button
        mt={3}
        w="100%"
        size="sm"
        variant="outline"
        color="whiteAlpha.900"
        borderColor="whiteAlpha.300"
        _hover={{ bg: "whiteAlpha.200" }}
        onClick={copyMap}
      >
        Copy MIDI Map
      </Button>
      <Text color="whiteAlpha.500" fontSize="xs" mt={3}>
        Hover any control for its exact MIDI id in the inspector.
      </Text>
    </Box>
  );
}

function KeyboardHint() {
  return (
    <Box textAlign="left">
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb={3}>
        KEYBOARD PADS
      </Text>
      <VStack align="stretch" spacing={1.5} fontFamily="mono" fontSize="xs" color="whiteAlpha.800">
        <Text>1 2 3 4 5 6 7 8</Text>
        <Text>Q W E R T Y U I</Text>
        <Text>A S D F G H J K</Text>
        <Text>Z X C V B N M ,</Text>
      </VStack>
      <Text color="whiteAlpha.500" fontSize="xs" mt={3}>
        Hold Shift to latch multiple pads. Hold Option for chord mode.
      </Text>
    </Box>
  );
}
