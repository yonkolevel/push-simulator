import { Box, Flex, Text, Badge } from "@chakra-ui/react";
import { useAppState } from "../../libs/push2/context/PushContext";

export default function MidiStatus() {
  const { notesPressed, controlsPressed } = useAppState();

  const activeNotes = notesPressed.size;
  const activeControls = controlsPressed.size;

  return (
    <Box>
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="medium" mb={2}>
        MIDI STATUS
      </Text>
      <Flex direction="column" gap={2}>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.800" fontSize="sm">
            Active Notes
          </Text>
          <Badge
            colorScheme={activeNotes > 0 ? "green" : "gray"}
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
            Connection
          </Text>
          <Badge
            colorScheme="green"
            variant="subtle"
            px={2}
            py={1}
            borderRadius="md"
          >
            Connected
          </Badge>
        </Flex>
      </Flex>
    </Box>
  );
}
