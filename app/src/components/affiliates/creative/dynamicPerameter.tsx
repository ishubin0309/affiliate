import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Plus } from "lucide-react";
const DynamicPerameter = () => {
  const [elements, setElements] = useState<JSX.Element[]>([]);

  const handleAddElement = () => {
    if (elements.length < 10) {
      setElements((prevElements) => [
        ...prevElements,
        <div key={prevElements.length} className="mt-4 w-full">
          <Select defaultValue={"1"}>
            <SelectTrigger className="border px-4 py-3  text-xs ">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent className="border text-xs">
              <SelectGroup>
                <SelectItem value={"1"}>Account 1</SelectItem>
                <SelectItem value={"2"}>Account 2</SelectItem>
                <SelectItem value={"3"}>Account 3</SelectItem>
                <SelectItem value={"4"}>Account 4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>,
      ]);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className="ml-2 h-10 w-10"
        size="rec"
        onClick={handleAddElement}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <div className="flex w-full">
        <div className="w-full">{elements}</div>
      </div>
    </>
  );
};

export default DynamicPerameter;
