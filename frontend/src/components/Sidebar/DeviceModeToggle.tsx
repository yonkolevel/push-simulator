import { Box, Button, ButtonGroup, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { SetLiveMode, SetUserMode } from "../../../wailsjs/go/push/AbletonPush";
import { releaseHeldMidi, useAppDispatch, useAppState } from "../../libs/push2/context/PushContext";

type DeviceMode = "live" | "user";

export default function DeviceModeToggle() {
  const dispatch = useAppDispatch();
  const { controlsPressed, notesPressed } = useAppState();
  const toast = useToast();
  const [mode, setMode] = useState<DeviceMode>("live");

  const handleModeChange = async (newMode: DeviceMode) => {
    try {
      await releaseHeldMidi(dispatch, { notesPressed, controlsPressed });
      if (newMode === "live") {
        await SetLiveMode();
      } else {
        await SetUserMode();
      }
      setMode(newMode);
    } catch (error) {
      console.error("Failed to set device mode:", error);
      toast({ title: "Could not switch device mode", status: "error", duration: 2800 });
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
      <Text color="whiteAlpha.500" fontSize="xs" mt={2}>
        Releases held notes/controls before changing the active output port.
      </Text>
    </Box>
  );
}
