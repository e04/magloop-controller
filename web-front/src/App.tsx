import { useEffect, useState } from "react";
import { Container, Stack } from "@chakra-ui/react";
import Controller from "./Controller";
import { MLA_1, MLA_2 } from "./useBandSetting";
import { useCoaxSwitcherClient } from "./CoaxSwitchrClient";

const antennas = [
  {
    id: MLA_1,
    boardAddress: "http://192.168.0.115",
  },
  {
    id: MLA_2,
    boardAddress: "http://192.168.0.117",
  },
] as const;

function App() {
  const coaxSwitcher = useCoaxSwitcherClient({
    boardAddress: "http://192.168.0.116/",
  });

  useEffect(() => {
    coaxSwitcher.getState();
  }, []);

  return (
    <Container py={4}>
      <Stack spacing={8}>
        {antennas.map((antenna) => (
          <Controller
            boardAddress={antenna.boardAddress}
            antenna={antenna.id}
            disabled={coaxSwitcher.state !== antenna.id}
            onClick={() => {
              if (coaxSwitcher.state === antenna.id) return;
              coaxSwitcher.switchToAntenna(antenna.id);
            }}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default App;
