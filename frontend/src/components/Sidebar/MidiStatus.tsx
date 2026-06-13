import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, Badge, HStack, useToast } from "@chakra-ui/react";
import { GetMIDIStatus } from "../../../wailsjs/go/push/AbletonPush";
import { clearMidiEvents, useAppDispatch, useAppState } from "../../libs/push2/context/PushContext";

type BackendMIDIStatus = {
  ready: boolean;
  livePort: string;
  userPort: string;
  mode: string;
  channel: number;
};

const eventLabel = (event: ReturnType<typeof useAppState>["lastMidiEvent"]) => {
  if (!event) return "None yet";
  const value = event.value === undefined ? "" : ` · value ${event.value}`;
  const velocity = event.velocity === undefined ? "" : ` · vel ${event.velocity}`;
  const channel = event.channel === undefined ? "" : ` · ch ${event.channel}`;
  const id = event.type === "pitch_bend" ? "" : ` ${event.id}`;
  return `${event.direction} · ${event.type.replace("_", " ")}${id}${velocity}${value}${channel}`;
};

const eventLogLine = (event: ReturnType<typeof useAppState>["midiEvents"][number]) => {
  const time = new Date(event.timestamp).toLocaleTimeString();
  return `${time} · ${eventLabel(event)}`;
};

export default function MidiStatus() {
  const { notesPressed, controlsPressed, lastMidiEvent, midiEvents, selectedControl, lastMidiError, midiChannel } = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const activeNotes = notesPressed.size;
  const activeControls = controlsPressed.size;
  const sentEvents = midiEvents.filter((event) => event.direction === "sent").length;
  const receivedEvents = midiEvents.filter((event) => event.direction === "received").length;
  const lastSentEvent = midiEvents.find((event) => event.direction === "sent");
  const lastReceivedEvent = midiEvents.find((event) => event.direction === "received");
  const [backendStatus, setBackendStatus] = useState<BackendMIDIStatus | null>(null);
  const activeOutputPort = backendStatus?.mode === "user"
    ? backendStatus?.userPort || "Ableton Push 2 User Port"
    : backendStatus?.livePort || "Ableton Push 2 Live Port";

  useEffect(() => {
    let cancelled = false;

    const refreshStatus = async () => {
      try {
        const status = await GetMIDIStatus();
        if (!cancelled) {
          setBackendStatus(status as BackendMIDIStatus);
        }
      } catch {
        if (!cancelled) {
          setBackendStatus(null);
        }
      }
    };

    refreshStatus();
    const interval = window.setInterval(refreshStatus, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [midiChannel]);

  const copyEventLog = async () => {
    if (midiEvents.length === 0) {
      toast({ title: "No MIDI events to copy", status: "info", duration: 1800 });
      return;
    }

    try {
      await navigator.clipboard.writeText(midiEvents.map(eventLogLine).join("\n"));
      toast({ title: "MIDI event log copied", status: "success", duration: 2200 });
    } catch {
      toast({ title: "Could not copy MIDI event log", status: "error", duration: 2800 });
    }
  };

  const sharedReportSections = () => [
    "Ports",
    `- Live: ${backendStatus?.livePort || "Ableton Push 2 Live Port"}`,
    `- User: ${backendStatus?.userPort || "Ableton Push 2 User Port"}`,
    `- Ready: ${backendStatus?.ready ? "yes" : "no"}`,
    `- Backend mode: ${backendStatus?.mode || "unknown"}`,
    `- Active output: ${activeOutputPort}`,
    `- Send channel: ${midiChannel}`,
    "",
    "Event totals",
    `- Sent: ${sentEvents}`,
    `- Received: ${receivedEvents}`,
    `- Stored: ${midiEvents.length}`,
    "",
    "Current state",
    `- Active notes: ${activeNotes}${activeNotes ? ` (${Array.from(notesPressed).join(", ")})` : ""}`,
    `- Active controls: ${activeControls}${activeControls ? ` (${Array.from(controlsPressed).join(", ")})` : ""}`,
    `- Last message: ${eventLabel(lastMidiEvent)}`,
    `- Last sent: ${eventLabel(lastSentEvent)}`,
    `- Last received: ${eventLabel(lastReceivedEvent)}`,
    `- Selected control: ${selectedControl ? `${selectedControl.name} (${selectedControl.type.toUpperCase()} ${selectedControl.id})` : "none"}`,
    `- Last MIDI error: ${lastMidiError ? `${lastMidiError.label}: ${lastMidiError.message}` : "none"}`,
    "",
    "Recent events",
    ...(midiEvents.length ? midiEvents.map(eventLogLine) : ["- none"]),
  ];

  const copyDebugReport = async () => {
    const report = [
      "Ableton Push 2 Simulator Debug Report",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      ...sharedReportSections(),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      toast({ title: "Debug report copied", status: "success", duration: 2200 });
    } catch {
      toast({ title: "Could not copy debug report", status: "error", duration: 2800 });
    }
  };

  const copyVerificationReport = async () => {
    const report = [
      "# MidiCircuit verification report",
      "",
      `Date/time: ${new Date().toLocaleString()}`,
      "Tester:",
      "Simulator commit:",
      "Simulator build/run mode: wails dev / wails build app",
      "MidiCircuit app/version:",
      "MidiCircuit platform: macOS / iOS simulator / iOS device",
      `Connected/listening port: ${activeOutputPort}`,
      "",
      "## Automated smoke checks",
      "",
      "- [ ] Port visibility: `go run ./tools/check-midi-ports.go`",
      "  Evidence:",
      "- [ ] External listener: `go run ./tools/check-midi-ports.go -listen -port \"Ableton Push 2 Live Port\" -seconds 15`",
      "  Evidence:",
      "- [ ] External sender: `go run ./tools/check-midi-ports.go -send -port \"Ableton Push 2 Live Port\" -note 36 -velocity 100 -cc 85 -bend 1024 -channel 1`",
      "  Evidence:",
      "",
      "## Real MidiCircuit checks",
      "",
      "- [ ] Port discovery",
      "  Evidence:",
      "- [ ] Test Note",
      "  Evidence:",
      "- [ ] Test CC",
      "  Evidence:",
      "- [ ] Test Bend",
      "  Evidence:",
      "- [ ] Pad interaction",
      "  Evidence:",
      "- [ ] Control interaction",
      "  Evidence:",
      "- [ ] Touch strip",
      "  Evidence:",
      "- [ ] Pad Sweep + Stop Sweep",
      "  Evidence:",
      "- [ ] CC Sweep + Stop Sweep",
      "  Evidence:",
      "- [ ] Panic / Reset MIDI",
      "  Evidence:",
      "- [ ] Persistence after restart/reload",
      "  Evidence:",
      "- [ ] Copy Report produces useful diagnostics",
      "  Evidence:",
      "",
      "## Simulator snapshot",
      "",
      ...sharedReportSections(),
      "",
      "## Verdict",
      "",
      "Result: PASS / FAIL / PARTIAL",
      "Open issues:",
      "Accepted out-of-scope items:",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      toast({ title: "Verification report copied", status: "success", duration: 2200 });
    } catch {
      toast({ title: "Could not copy verification report", status: "error", duration: 2800 });
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
          MIDI STATUS
        </Text>
        <Flex align="center" gap={2}>
          <Button size="xs" variant="ghost" color="whiteAlpha.800" onClick={copyDebugReport}>
            Copy Report
          </Button>
          <Badge
            colorScheme={backendStatus?.ready ? "green" : "red"}
            variant="subtle"
            borderRadius="full"
            px={2}
          >
            {backendStatus?.ready ? "Ready" : "Not ready"}
          </Badge>
        </Flex>
      </HStack>
      <Flex direction="column" gap={3}>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.800" fontSize="sm">
            Active Notes
          </Text>
          <Badge
            colorScheme={activeNotes > 0 ? "teal" : "gray"}
            variant="subtle"
            px={2}
            py={1}
            borderRadius="md"
          >
            {activeNotes}
          </Badge>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.800" fontSize="sm">
            Active Controls
          </Text>
          <Badge
            colorScheme={activeControls > 0 ? "blue" : "gray"}
            variant="subtle"
            px={2}
            py={1}
            borderRadius="md"
          >
            {activeControls}
          </Badge>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.800" fontSize="sm">
            Send Channel
          </Text>
          <Badge colorScheme="teal" variant="subtle" px={2} py={1} borderRadius="md">
            {midiChannel}
          </Badge>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.800" fontSize="sm">
            Event Direction
          </Text>
          <HStack spacing={1.5}>
            <Badge colorScheme="teal" variant="subtle" px={2} py={1} borderRadius="md">
              {sentEvents} sent
            </Badge>
            <Badge colorScheme="purple" variant="subtle" px={2} py={1} borderRadius="md">
              {receivedEvents} received
            </Badge>
          </HStack>
        </Flex>
        <Box bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.100" borderRadius="lg" p={3}>
          <Text color="whiteAlpha.600" fontSize="xs" mb={1}>
            Last message
          </Text>
          <Text color="white" fontSize="sm" fontFamily="mono" textTransform="uppercase">
            {eventLabel(lastMidiEvent)}
          </Text>
          <Flex direction="column" gap={1.5} mt={3}>
            <Box>
              <Text color="whiteAlpha.500" fontSize="xs">
                Last sent
              </Text>
              <Text color="teal.100" fontSize="xs" fontFamily="mono" textTransform="uppercase">
                {eventLabel(lastSentEvent)}
              </Text>
            </Box>
            <Box>
              <Text color="whiteAlpha.500" fontSize="xs">
                Last received
              </Text>
              <Text color="purple.100" fontSize="xs" fontFamily="mono" textTransform="uppercase">
                {eventLabel(lastReceivedEvent)}
              </Text>
            </Box>
          </Flex>
        </Box>
        {lastMidiError && (
          <Box bg="red.900" border="1px solid" borderColor="red.400" borderRadius="lg" p={3}>
            <Text color="red.100" fontSize="xs" fontWeight="bold" mb={1}>
              Last MIDI error
            </Text>
            <Text color="white" fontSize="xs" fontFamily="mono">
              {lastMidiError.label}: {lastMidiError.message}
            </Text>
            <Text color="red.100" fontSize="xs" mt={1}>
              {new Date(lastMidiError.timestamp).toLocaleTimeString()}
            </Text>
          </Box>
        )}
        <Box bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.100" borderRadius="lg" p={3}>
          <Text color="whiteAlpha.600" fontSize="xs" mb={1}>
            Control inspector
          </Text>
          {selectedControl ? (
            <>
              <Text color="white" fontSize="sm" fontFamily="mono" textTransform="uppercase">
                {selectedControl.name}
              </Text>
              <Text color="teal.100" fontSize="xs" fontFamily="mono" mt={1}>
                {selectedControl.type.toUpperCase()} {selectedControl.id}
              </Text>
            </>
          ) : (
            <Text color="whiteAlpha.500" fontSize="xs">
              Hover or focus a control to inspect its MIDI mapping.
            </Text>
          )}
        </Box>
        <Box bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.100" borderRadius="lg" p={3}>
          <Text color="whiteAlpha.600" fontSize="xs" mb={1}>
            Connect MIDI apps to
          </Text>
          <Text color="white" fontSize="xs" fontFamily="mono">
            {backendStatus?.livePort || "Ableton Push 2 Live Port"}
          </Text>
          <Text color="whiteAlpha.600" fontSize="xs" fontFamily="mono" mt={1}>
            or {backendStatus?.userPort || "Ableton Push 2 User Port"}
          </Text>
          <Flex justify="space-between" mt={2} color="whiteAlpha.600" fontSize="xs">
            <Text>Backend mode</Text>
            <Text fontFamily="mono" textTransform="uppercase">
              {backendStatus?.mode || "unknown"}
            </Text>
          </Flex>
          <Box mt={2}>
            <Text color="whiteAlpha.600" fontSize="xs">
              Active output
            </Text>
            <Text color="teal.100" fontSize="xs" fontFamily="mono">
              {activeOutputPort}
            </Text>
          </Box>
          <Button
            mt={3}
            w="100%"
            size="sm"
            variant="outline"
            color="whiteAlpha.900"
            borderColor="whiteAlpha.300"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={copyVerificationReport}
          >
            Copy Verification Report
          </Button>
          <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
            Use the configurable Test Note and Test CC controls to confirm routing. The report includes a checklist, this snapshot, and recent events.
          </Text>
        </Box>
        <Box bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" borderRadius="lg" p={3}>
          <Flex justify="space-between" align="center" mb={2}>
            <Text color="whiteAlpha.600" fontSize="xs">
              Event history · {midiEvents.length} saved · {sentEvents} sent / {receivedEvents} received
            </Text>
            <Flex gap={1}>
              <Button size="xs" variant="ghost" color="whiteAlpha.800" onClick={copyEventLog}>
                Copy
              </Button>
              <Button size="xs" variant="ghost" color="whiteAlpha.800" onClick={() => clearMidiEvents(dispatch)}>
                Clear
              </Button>
            </Flex>
          </Flex>
          <Flex direction="column" gap={1.5} maxH="168px" overflowY="auto">
            {midiEvents.length === 0 ? (
              <Text color="whiteAlpha.500" fontSize="xs">
                Press a pad or send MIDI to see the stream.
              </Text>
            ) : (
              midiEvents.slice(0, 12).map((event) => (
                <Text
                  key={`${event.timestamp}-${event.direction}-${event.type}-${event.id}-${event.velocity}`}
                  color={event.direction === "sent" ? "teal.100" : "purple.100"}
                  fontSize="xs"
                  fontFamily="mono"
                  textTransform="uppercase"
                >
                  {eventLabel(event)}
                </Text>
              ))
            )}
          </Flex>
          {midiEvents.length > 12 && (
            <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
              Showing latest 12. Copy includes all saved events.
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
