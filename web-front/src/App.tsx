import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Slider,
  SliderTrack,
  SliderThumb,
  Stack,
  Spinner,
  HStack,
  Badge,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { BOARD_MAX_VALUE, useBoardClient } from "./BoardClient";

const presetButtons = [
  { value: 2495, label: "7000" },
  { value: 2420, label: "7100" },
  { value: 910, label: "10100" },
  { value: 160, label: "14000" },
];

const bands = [
  { label: "40m", start: 2495, width: 75 },
  { label: "30m", start: 910, width: 20 },
  { label: "20m", start: 160, width: 10 },
];

const fineTuneButtons = [
  { value: 50, label: "◁◁◁◁" },
  { value: 25, label: "◁◁◁" },
  { value: 10, label: "◁◁" },
  { value: 5, label: "◁" },
  { value: -5, label: "▶" },
  { value: -10, label: "▶▶" },
  { value: -25, label: "▶▶▶" },
  { value: -50, label: "▶▶▶▶" },
];

function App() {
  const boardClient = useBoardClient();

  useEffect(() => {
    boardClient.getPosition();
  }, []);

  return (
    <Container py={4}>
      <Stack spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Badge w={12} align="right">
              {boardClient.position}
            </Badge>
            {boardClient.isBusy && <Spinner />}
          </HStack>

          <Button
            variant="outline"
            colorScheme="red"
            onClick={() => boardClient.reset()}
          >
            RESET
          </Button>
        </HStack>
        <Box h={6}></Box>
        <Stack>
          <Slider
            max={BOARD_MAX_VALUE}
            min={0}
            step={5}
            value={BOARD_MAX_VALUE - boardClient.position}
            onChange={(value) => boardClient.moveTo(BOARD_MAX_VALUE - value)}
          >
            <SliderTrack h={8} position="relative">
              {bands.map((band) => (
                <Tooltip
                  color="white"
                  bg="gray.600"
                  label={band.label}
                  placement="top"
                  hasArrow
                  isOpen
                >
                  <Box
                    position="absolute"
                    backgroundColor="white"
                    opacity={0.5}
                    h="full"
                    top="0"
                    left={`${(1 - band.start / BOARD_MAX_VALUE) * 100}%`}
                    w={`${(band.width / BOARD_MAX_VALUE) * 100}%`}
                  />
                </Tooltip>
              ))}
            </SliderTrack>
            <SliderThumb
              borderRadius={0}
              w="1px"
              border="none"
              bgColor="red"
              h={8}
              sx={{
                "&:focus": {
                  boxShadow: "none",
                },
              }}
            ></SliderThumb>
          </Slider>
        </Stack>

        <ButtonGroup size="sm" isAttached variant="outline" w="full">
          {presetButtons.map((item) => (
            <Button w="full" onMouseDown={() => boardClient.moveTo(item.value)}>
              {item.label}
            </Button>
          ))}
        </ButtonGroup>

        <ButtonGroup size="sm" isAttached variant="outline" w="full">
          {fineTuneButtons.map((item) => (
            <Button w="full" onMouseDown={() => boardClient.move(item.value)}>
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
    </Container>
  );
}

export default App;
