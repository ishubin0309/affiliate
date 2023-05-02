import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";

interface IProps {
  setParametersValue?: (value: string[]) => void;
}

interface InputField {
  id: string;
  type: string;
  value: string;
  placeholder: string;
}

export function AddDynamicParameter({ setParametersValue }: IProps) {
  const [dynamicParameterDisabled, setDynamicParameterDisabled] =
    useState<boolean>(false);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  const [inputFields, setInputFields] = useState<InputField[]>([
    {
      id: generateId(),
      type: "text",
      value: "",
      placeholder: "Add parameter",
    },
  ]);

  const addInput = () => {
    // Check if there is any empty field
    const emptyField = inputFields.find(
      (inputField) => inputField.value === ""
    );

    // If there is an empty field, focus on it and return
    if (emptyField) {
      document.getElementById(emptyField.id)?.focus();
      return;
    }

    // Add a new input field if there are no empty fields
    const newInputFields = [
      ...inputFields,
      {
        id: generateId(),
        type: "text",
        value: "",
        placeholder: `Add parameter`,
      },
    ];
    setInputFields(newInputFields);

    // Disable adding more fields if the maximum limit is reached
    if (newInputFields.length === 9) {
      setDynamicParameterDisabled(true);
    }
  };

  const removeInput = (id: string) => {
    const newInputFields = inputFields.filter(
      (inputField) => inputField.id !== id
    );
    setInputFields(newInputFields);
    if (dynamicParameterDisabled && newInputFields.length < 9) {
      setDynamicParameterDisabled(false);
    }
  };

  const editInput = (id: string, value: string) => {
    const newInputFields = inputFields.map((inputField) => {
      if (inputField.id === id) {
        return {
          ...inputField,
          value: value,
        };
      }
      return inputField;
    });
    setInputFields(newInputFields);
  };

  const inputFieldElements = inputFields.map((inputField, index) => (
    <div key={inputField.id} className="mb-2 flex w-full">
      <Input
        className="w-full"
        id={inputField.id}
        type={inputField.type}
        placeholder={inputField.placeholder}
        value={inputField.value}
        onChange={(e) => editInput(inputField.id, e.target.value)}
      />
      {index >= 1 && (
        <Button
          variant="primary"
          className="ml-2 h-10 w-10"
          size="rec"
          onClick={() => removeInput(inputField.id)}
        >
          <Minus className="h-4 w-4" />
        </Button>
      )}
      {index === 0 && (
        <Button
          disabled={dynamicParameterDisabled}
          variant="primary"
          className="ml-2 h-10 w-10"
          size="rec"
          onClick={addInput}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  ));

  return <>{inputFieldElements}</>;
}
