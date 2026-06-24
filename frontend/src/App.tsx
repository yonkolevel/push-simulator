import { Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import Push from "./components/Push";
import Sidebar from "./components/Sidebar";
import { AppProvider } from "./libs/push2/context/PushContext";
import { PushPalette } from "./libs/push2/colors";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppProvider>
      <Flex
        id="app"
        h="100vh"
        w="100vw"
        bg={`radial-gradient(circle at 35% 22%, ${PushPalette.pageGlow} 0%, #10100e 42%, ${PushPalette.page} 100%)`}
        overflow="hidden"
        position="relative"
      >
        <Flex
          flex={1}
          align="center"
          justify="center"
          overflow="hidden"
          px={{ base: 3, md: 8 }}
          py={{ base: 4, md: 8 }}
        >
          <Push />
        </Flex>

        {!sidebarOpen && (
          <IconButton
            aria-label="Open settings"
            icon={<ChevronLeftIcon />}
            position="fixed"
            right="10px"
            top="50%"
            transform="translateY(-50%)"
            onClick={() => setSidebarOpen(true)}
            bg="whiteAlpha.200"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.300"
            _hover={{ bg: "whiteAlpha.300" }}
            size="sm"
            zIndex={10}
          />
        )}

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
