import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SetLiveMode, SetUserMode } from "../../../wailsjs/go/push/AbletonPush";

type DeviceMode = "live" | "user";

export default function DeviceModeToggle() {
  const [mode, setMode] = useState<DeviceMode>("live");

  const handleModeChange = async (newMode: DeviceMode) => {
    try {
      if (newMode === "live") {
        await SetLiveMode();
      } else {
        await SetUserMode();
      }
      setMode(newMode);
    } catch (error) {
      console.error("Failed to set device mode:", error);
    }
  };

  return (
    <Box>
      <Text color="whiteAlpha.700" fontSize="xs" fontWeight="medium" mb={2}>
        DEVICE MODE
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline" w="100%">
        <Button
          flex={1}
          onClick={() => handleModeChange("live")}
          bg={mode === "live" ? "whiteAlpha.200" : "transparent"}
          color="white"
          borderColor="whiteAlpha.300"
          _hover={{ bg: "whiteAlpha.300" }}
        >
          Live
        </Button>
        <Button
          flex={1}
          onClick={() => handleModeChange("user")}
          bg={mode === "user" ? "whiteAlpha.200" : "transparent"}
          color="white"
          borderColor="whiteAlpha.300"
          _hover={{ bg: "whiteAlpha.300" }}
        >
          User
        </Button>
      </ButtonGroup>
    </Box>
  );
}
