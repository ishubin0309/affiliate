import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChoiceType } from "@/utils/zod-meta";

interface Props {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  choices: ChoiceType[];
}

export const SelectInput = ({
  onChange,
  value,
  placeholder,
  choices,
}: Props) => {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="pr-2 text-sm font-light text-black">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="pr-2 text-xs font-light text-black">
        <SelectGroup>
          {choices.map((choice) => {
            const { id, title } =
              typeof choice === "string"
                ? { id: choice, title: choice }
                : choice;

            return (
              <SelectItem value={String(id)} key={id}>
                {title}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
