import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Flags from "country-flag-icons/react/3x2";

export interface OptionsItem {
  title: string;
  icon: string;
}

export interface SelectLanguageDropdownProps {
  options: OptionsItem[];
  selectedOptions?: OptionsItem | null;
  onLanguageChange: (value: OptionsItem | null) => void;
}

const SelectLanguageDropdown = ({
  options,
  selectedOptions,
  onLanguageChange,
}: SelectLanguageDropdownProps) => {
  const SelectedFlag =
    Flags[(selectedOptions?.icon ?? "US").toUpperCase() as keyof typeof Flags];

  return (
    <>
      <div className="text-blueGray-500 block md:pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="text">
              {selectedOptions ? (
                <>
                  <SelectedFlag className="mr-2 h-7 w-7" />
                  <span className="pl-2 font-semibold text-[#303134]">{selectedOptions?.title}</span>
                </>
              ) : (
                <>
                  <SelectedFlag className="mr-2 h-7 w-7 " />
                  <span className="pl-2 font-semibold text-[#303134]">English</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {options.map((value: OptionsItem, index: number) => {
              const FlagComponent =
                Flags[value.icon.toUpperCase() as keyof typeof Flags];
              return (
                <DropdownMenuItem
                  key={index.toString()}
                  onClick={() => onLanguageChange(value)}
                >
                  <FlagComponent className="mr-2 h-5 w-5" />
                  <span className="pl-2 font-semibold text-[#303134]">{value?.title ?? ""}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
export default SelectLanguageDropdown;
