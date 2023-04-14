import React from "react";
import SelectLanguageDropdown, {
  OptionsItem,
} from "../Dropdowns/SelectLanguageDropdown";

const languageDropDown = [
  {
    title: "English",
    icon: "US",
  },
  {
    title: "Russian",
    icon: "RU",
  },
  {
    title: "Dutch",
    icon: "NL",
  },
  {
    title: "Spain",
    icon: "ES",
  },
  {
    title: "French",
    icon: "FR",
  },
  {
    title: "Italian",
    icon: "IT",
  },
  {
    title: "Arabic",
    icon: "AR",
  },
  {
    title: "Chinese",
    icon: "CN",
  },
  {
    title: "Portugese",
    icon: "PT",
  },
  {
    title: "Hebrew",
    icon: "IL",
  },
  {
    title: "Japanese",
    icon: "JP",
  },
];

const DropdownComponent = () => {
  const [selectLanguageItem, setSelectLanguageItem] =
    React.useState<OptionsItem | null>(null);

  return (
    <div className="mt-4 flex">
      <SelectLanguageDropdown
        onLanguageChange={(val) => setSelectLanguageItem(val)}
        selectedOptions={selectLanguageItem}
        options={languageDropDown}
      />
    </div>
  );
};

const meta = {
  component: DropdownComponent,
};

export default meta;

export const Dropdown = {
  render: (args: any) => {
    return (
      <div className="mt-4 flex">
        <DropdownComponent />
      </div>
    );
  },
};
