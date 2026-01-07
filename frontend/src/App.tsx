import { Box, Flex, Heading, IconButton, VStack, Text, Divider } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import Push from "./components/Push";
import { AppProvider } from "./libs/push2/context/PushContext";

const SIDEBAR_WIDTH = 280;
const BG_COLOR = "#1B2636";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppProvider>
      <Flex
        id="app"
        h="100vh"
        w="100vw"
        bg={BG_COLOR}
        overflow="hidden"
        position="relative"
      >
        {/* Main area - Push simulator */}
        <Flex
          flex={1}
          align="center"
          justify="center"
          overflow="hidden"
          p={4}
        >
          <Push />
        </Flex>

        {/* Sidebar toggle button (visible when sidebar closed) */}
        {!sidebarOpen && (
          <IconButton
            aria-label="Open settings"
            icon={<ChevronLeftIcon />}
            position="fixed"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            onClick={() => setSidebarOpen(true)}
            bg="whiteAlpha.200"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            size="sm"
            zIndex={10}
          />
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <Box
            w={`${SIDEBAR_WIDTH}px`}
            minW={`${SIDEBAR_WIDTH}px`}
            bg="blackAlpha.400"
            borderLeft="1px solid"
            borderColor="whiteAlpha.200"
            p={4}
            overflowY="auto"
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="sm" color="white">Settings</Heading>
              <IconButton
                aria-label="Close settings"
                icon={<ChevronRightIcon />}
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                color="white"
                size="sm"
                _hover={{ bg: "whiteAlpha.200" }}
              />
            </Flex>
            <Divider borderColor="whiteAlpha.300" mb={4} />
            <VStack align="stretch" spacing={4}>
              <Text color="whiteAlpha.700" fontSize="sm">
                Settings and controls will appear here.
              </Text>
            </VStack>
          </Box>
        )}
      </Flex>
    </AppProvider>
  );
}

// Simple chevron icons
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
  </svg>
);

export default App;
