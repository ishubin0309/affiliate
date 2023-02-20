import React from "react";
import { Stack, Heading, Flex, Button, Text } from "@chakra-ui/react";

interface Props {
  onSubmit: () => void;
  onPrevious: () => void;
}

export const FinishForm = ({ onSubmit, onPrevious }: Props) => {
  return (
    <Stack m={12} gap={2}>
      <Heading as="h6" size="xs">
        Step 1: Finish Pixel
      </Heading>
      <Text fontSize="sm">
        The pixel will be idle until the Affiliate Manager will approve it.
      </Text>
      <Flex width="100%" justify="flex-start">
        <Button minW={36} onClick={onPrevious} mr={4} size="md" variant="ghost">
          Prev
        </Button>
        <Button size="md" minW={36} variant="solid" onClick={onSubmit}>
          Finish
        </Button>
      </Flex>
    </Stack>
  );
};
