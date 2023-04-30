import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";

interface IProps {
  setPermeterValues?: any;
}

interface InputField {
  type: string;
  value: string;
  placeholder: string;
}

export function AddDynamicPerameter({ setPermeterValues }: IProps) {
  const [dynamicPerameterDisabled, setDynamicPerameterDisabled] =
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
      setDynamicPerameterDisabled(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const newInputFields = inputFields.slice();
    newInputFields[index].value = e.target.value;
    setInputFields(newInputFields);
    let values = newInputFields.map((item) => item.value);
    setPermeterValues(values);
  };

  const inputFieldElements = inputFields.map((inputField, index) => (
    <div key={index} className="mt-4 w-full">
      <Input
        className="w-full"
        id={String(index)}
        type={inputField.type}
        placeholder={inputField.placeholder}
        value={inputField.value}
        onChange={(e) => handleChange(e, index)}
      />
    </div>
  ));

  return (
    <>
      <Button
        disabled={dynamicPerameterDisabled}
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
