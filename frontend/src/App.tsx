import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";
import Push from "./components/Push";
import { AppProvider } from "./libs/push2/context/PushContext";

function App() {
  return (
    <AppProvider>
      <div id="app" className="App">
        <Flex>
          <Box>
            <Push />
          </Box>
          <Box>
            <Text variant="heading">Test</Text>
          </Box>
        </Flex>
      </div>
    </AppProvider>
  );
}

export default App;
