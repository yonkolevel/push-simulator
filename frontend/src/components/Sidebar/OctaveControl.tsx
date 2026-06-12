import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SendCCOn, SendCCOff } from "../../../wailsjs/go/push/AbletonPush";

// Control IDs for octave buttons (from controls.ts)
const OCTAVE_UP = 55;
const OCTAVE_DOWN = 54;

export default function OctaveControl() {
  const [octave, setOctave] = useState(3);

  const handleOctaveChange = async (direction: "up" | "down") => {
    const newOctave = direction === "up" ? octave + 1 : octave - 1;

    // Clamp to valid MIDI octave range
    if (newOctave < 0 || newOctave > 8) return;

    try {
      const controlId = direction === "up" ? OCTAVE_UP : OCTAVE_DOWN;
      await SendCCOn(controlId);
      await SendCCOff(controlId);
      setOctave(newOctave);
    } catch (error) {
      console.error("Failed to change octave:", error);
    }
  };

  return (
    <Box>
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="medium" mb={2}>
        OCTAVE
      </Text>
      <Flex align="center" gap={3}>
        <Button
          size="sm"
          onClick={() => handleOctaveChange("down")}
          isDisabled={octave <= 0}
          bg="transparent"
          color="white"
          borderColor="whiteAlpha.300"
          borderWidth={1}
          _hover={{ bg: "whiteAlpha.200" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          -
        </Button>
        <Text
          color="white"
          fontSize="lg"
          fontWeight="bold"
          minW="40px"
          textAlign="center"
        >
          {octave}
        </Text>
        <Button
          size="sm"
          onClick={() => handleOctaveChange("up")}
          isDisabled={octave >= 8}
          bg="transparent"
          color="white"
          borderColor="whiteAlpha.300"
          borderWidth={1}
          _hover={{ bg: "whiteAlpha.200" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          +
        </Button>
      </Flex>
    </Box>
  );
}
