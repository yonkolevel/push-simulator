import { Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import Push from "./components/Push";
import Sidebar from "./components/Sidebar";
import { AppProvider } from "./libs/push2/context/PushContext";

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
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </Flex>
    </AppProvider>
  );
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

export default App;
