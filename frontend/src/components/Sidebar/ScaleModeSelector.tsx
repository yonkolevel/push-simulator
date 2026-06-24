import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SetScaleMode } from "../../../wailsjs/go/push/AbletonPush";

type ScaleMode = "in_key" | "chromatic";

export default function ScaleModeSelector() {
  const [mode, setMode] = useState<ScaleMode>("in_key");

  const handleModeChange = async (newMode: ScaleMode) => {
    try {
      await SetScaleMode(newMode as any);
      setMode(newMode);
    } catch (error) {
      console.error("Failed to set scale mode:", error);
    }
  };

  return (
    <Box>
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="medium" mb={2}>
        SCALE MODE
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline" w="100%">
        <Button
          flex={1}
          onClick={() => handleModeChange("in_key")}
          bg={mode === "in_key" ? "whiteAlpha.200" : "transparent"}
          color="white"
          borderColor="whiteAlpha.300"
          _hover={{ bg: "whiteAlpha.300" }}
        >
          In Key
        </Button>
        <Button
          flex={1}
          onClick={() => handleModeChange("chromatic")}
          bg={mode === "chromatic" ? "whiteAlpha.200" : "transparent"}
          color="white"
          borderColor="whiteAlpha.300"
          _hover={{ bg: "whiteAlpha.300" }}
        >
          Chromatic
        </Button>
      </ButtonGroup>
    </Box>
  );
}
