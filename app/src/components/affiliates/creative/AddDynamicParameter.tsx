import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";

interface IProps {
  setParametersValue?: (value: string[]) => void;
}

interface InputField {
  type: string;
  value: string;
  placeholder: string;
}

export function AddDynamicParameter({ setParametersValue }: IProps) {
  const [dynamicParameterDisabled, setDynamicParameterDisabled] =
    useState<boolean>(false);
  const [inputFields, setInputFields] = useState<InputField[]>([]);

  const addInput = () => {
    const newInputFields = [
      ...inputFields,
      {
        type: "text",
        value: "",
        placeholder: `Add parameter ${inputFields.length + 1}`,
      },
    ];
    setInputFields(newInputFields);
    if (newInputFields.length === 9) {
      setDynamicParameterDisabled(true);
    }
  };

  const inputFieldElements = inputFields.map((inputField, index) => (
    <div key={index} className="mt-4 w-full">
      <Input
        className="w-full"
        id={String(index)}
        type={inputField.type}
        placeholder={inputField.placeholder}
        value={inputField.value}
      />
    </div>
  ));

  return (
    <>
      <Button
        disabled={dynamicParameterDisabled}
        variant="primary"
        className="ml-2 h-10 w-10"
        size="rec"
        onClick={addInput}
      >
        <Plus className="h-4 w-4" />
      </Button>
      {inputFieldElements}
    </>
  );
}
