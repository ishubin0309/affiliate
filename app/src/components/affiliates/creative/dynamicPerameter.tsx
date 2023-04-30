import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
interface IPropsPerameter {
  permeterValues: { [key: string]: string };
  setPermeterValues: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

const DynamicPerameter = ({
  permeterValues,
  setPermeterValues,
}: IPropsPerameter) => {
  const [dynamicPerameterFields, setDynamicPerameterFields] = useState<
    JSX.Element[]
  >([]);
  const [perameterFieldsId, setPerameterFieldsId] = useState(0);
  useEffect(() => {
    console.log(permeterValues);
  }, [permeterValues]);
  const handleAddElement = () => {
    if (dynamicPerameterFields.length < 10) {
      const id = `perameter-fields-${perameterFieldsId}`;
      setPerameterFieldsId(perameterFieldsId + 1);
      setDynamicPerameterFields((prevPerameters) => [
        ...prevPerameters,
        <div key={prevPerameters.length} className="mt-4 w-full">
          <Input
            className="w-full"
            id={id}
            type="text"
            placeholder={`Add perameter ${dynamicPerameterFields.length}`}
            value={permeterValues[id] || ""}
            onChange={(e) => {
              console.log(e.target.value, "eeeeeeeeeee", id);

              // setPermeterValues((prev) => ({
              //   ...prev,
              //   [id]: e.target.value,
              // }));
            }}
          />
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
        disabled={dynamicPerameterFields.length === 10 ? true : false}
        onClick={handleAddElement}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <div className="flex w-full">
        <div className="w-full">{dynamicPerameterFields}</div>
      </div>
    </>
  );
};

export default DynamicPerameter;
