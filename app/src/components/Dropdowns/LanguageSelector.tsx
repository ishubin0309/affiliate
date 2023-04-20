import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Flags from "country-flag-icons/react/3x2";

export interface LanguageOption {
  title: string;
  icon: string;
}

interface Props {
  options: LanguageOption[];
  selectedOption?: LanguageOption | null;
  onLanguageChange: (value: LanguageOption | null) => void;
}

const renderSelectedOption = (selectedOption: LanguageOption) => {
  const SelectedFlag =
    Flags[(selectedOption.icon ?? "US").toUpperCase() as keyof typeof Flags];

  return (
    <>
      <SelectedFlag className="mr-2 h-7 w-7" />
      <span className="pl-2 font-semibold text-[#303134]">
        {selectedOption.title}
      </span>
    </>
  );
};

const renderDropdownMenu = (
  options: LanguageOption[],
  onLanguageChange: Props["onLanguageChange"]
) => {
  return options.map((option: LanguageOption, index: number) => {
    const FlagComponent =
      Flags[option.icon.toUpperCase() as keyof typeof Flags];

    return (
      <DropdownMenuItem
        key={index.toString()}
        onClick={() => onLanguageChange(option)}
      >
        <FlagComponent className="mr-2 h-5 w-5" />
        <span className="pl-2 font-semibold text-[#303134]">
          {option.title ?? ""}
        </span>
      </DropdownMenuItem>
    );
  });
};

export const LanguageSelector = ({
  options,
  selectedOption,
  onLanguageChange,
}: Props) => {
  return (
    <>
      <div className="text-blueGray-500 block md:pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {renderSelectedOption(
                selectedOption || { title: "English", icon: "US" }
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {renderDropdownMenu(options, onLanguageChange)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
