import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import ScaleModeSelector from "./ScaleModeSelector";
import DeviceModeToggle from "./DeviceModeToggle";
import OctaveControl from "./OctaveControl";
import MidiStatus from "./MidiStatus";

interface SidebarProps {
  onClose: () => void;
}

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
  </svg>
);

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <Box
      w="280px"
      minW="280px"
      bg="blackAlpha.400"
      borderLeft="1px solid"
      borderColor="whiteAlpha.200"
      p={4}
      overflowY="auto"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="sm" color="white">
          Settings
        </Heading>
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

      <Divider borderColor="whiteAlpha.300" mb={4} />

      <VStack align="stretch" spacing={6}>
        <MidiStatus />
        <Divider borderColor="whiteAlpha.200" />
        <DeviceModeToggle />
        <Divider borderColor="whiteAlpha.200" />
        <ScaleModeSelector />
        <Divider borderColor="whiteAlpha.200" />
        <OctaveControl />
      </VStack>
    </Box>
  );
}
