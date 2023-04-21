import type { CheckboxGroupProps } from "@chakra-ui/react";
import {
  Box,
  Checkbox,
  HStack,
  Stack,
  useRadio,
  CheckboxGroup as ChakraCheckboxGroup,
} from "@chakra-ui/react";
import React from "react";
import type { ChoiceType } from "@/utils/zod-meta";
import { useTsController } from "@/components/libs/react-ts-form";
import { useMetaEx } from "@/components/libs/react-ts-form/FieldContext";

interface Props extends CheckboxGroupProps {
  choices: ChoiceType[];
}

export const CheckboxGroup = ({}: Props) => {
  const { field, error, formContext } = useTsController<string>();
  const {
    type,
    choices,
    disabled,
    label,
    placeholder,
    control: controlName,
  } = useMetaEx();

  if (!choices) {
    throw new Error(`CheckboxGroup: choices is not defined`);
  }

  return (
    <ChakraCheckboxGroup>
      <Stack spacing={1} direction="column">
        {choices.map((choice, idx) => {
          const { id, title } =
            typeof choice === "string" ? { id: choice, title: choice } : choice;

          return (
            <Checkbox key={id} value={String(id)}>
              {title}
            </Checkbox>
          );
        })}
      </Stack>
    </ChakraCheckboxGroup>
  );
};
