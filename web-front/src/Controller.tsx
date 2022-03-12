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
  Text,
} from "@chakra-ui/react";
import { useMLAControllerClient } from "./MLAControllerClient";
import { useBandSetting, MLA_1, MLA_2 } from "./useBandSetting";
const BOARD_MAX_VALUE = 3120;

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

const Controller: React.VFC<{
  boardAddress: string;
  antenna: MLA_1 | MLA_2;
  disabled: boolean;
  onClick: () => void;
}> = ({ boardAddress, antenna, disabled, onClick }) => {
  const boardClient = useMLAControllerClient({
    boardAddress,
  });

  const { state, dispatch } = useBandSetting();

  useEffect(() => {
    boardClient.getPosition();
  }, []);

  return (
    <Stack spacing={4} opacity={disabled ? 0.3 : 1} onClick={onClick}>
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
      <Stack spacing={4}>
        <Slider
          max={BOARD_MAX_VALUE}
          min={0}
          step={5}
          value={BOARD_MAX_VALUE - boardClient.position}
          onChange={(value) => boardClient.moveTo(BOARD_MAX_VALUE - value)}
        >
          <SliderTrack h={8} position="relative">
            {Object.entries(state)
              .filter(([_, info]) => info.antenna === antenna)
              .map(([label, info]) => (
                <Box
                  position="absolute"
                  backgroundColor="white"
                  opacity={0.5}
                  h="full"
                  top="0"
                  left={`${(1 - info.start.value / BOARD_MAX_VALUE) * 100}%`}
                  w={`${
                    ((info.start.value - info.end.value) / BOARD_MAX_VALUE) *
                    100
                  }%`}
                />
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
        <Stack>
          {Object.entries(state)
            .filter(([_, info]) => info.antenna === antenna)
            .map(([label, info]) => (
              <HStack>
                <Button
                  w={20}
                  size="sm"
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => {
                    dispatch({
                      type: "set",
                      payload: {
                        band: label as any,
                        side: "start",
                        value: boardClient.position,
                      },
                    });
                  }}
                >
                  {info.start.freq.toLocaleString()}
                </Button>
                <Slider
                  max={info.start.value - info.end.value}
                  min={0}
                  step={1}
                  value={info.start.value - boardClient.position}
                  onChange={(value) =>
                    boardClient.moveTo(info.start.value - value)
                  }
                >
                  <SliderTrack h={8} position="relative">
                    {[...Array(Math.floor((info.end.freq - info.start.freq) / 50))].map(
                      (_, index, array) => (
                        <>
                          <Box
                            position="absolute"
                            backgroundColor="white"
                            opacity={0.5}
                            h="full"
                            top="0"
                            left={`${(100 / array.length) * (1 + index)}%`}
                            w={"1px"}
                          />
                          <Text
                            position="absolute"
                            opacity={0.5}
                            h="full"
                            top="18px"
                            left={`calc(${
                              (100 / array.length) * (1 + index)
                            }% + 4px)`}
                            fontSize="4px"
                          >
                            {Math.floor(
                              info.start.freq +
                                ((info.end.freq - info.start.freq) /
                                  array.length) *
                                  (1 + index)
                            ).toLocaleString()}
                          </Text>
                        </>
                      )
                    )}
                  </SliderTrack>
                  <SliderThumb
                    hidden={
                      !(
                        info.start.value > boardClient.position &&
                        info.end.value < boardClient.position
                      )
                    }
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
                <Button
                  w={20}
                  size="sm"
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => {
                    dispatch({
                      type: "set",
                      payload: {
                        band: label as any,
                        side: "end",
                        value: boardClient.position,
                      },
                    });
                  }}
                >
                  {info.end.freq.toLocaleString()}
                </Button>
              </HStack>
            ))}
        </Stack>
      </Stack>

      <ButtonGroup size="sm" isAttached variant="outline" w="full">
        {fineTuneButtons.map((item) => (
          <Button w="full" onMouseDown={() => boardClient.move(item.value)}>
            {item.label}
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
};

export default Controller;
