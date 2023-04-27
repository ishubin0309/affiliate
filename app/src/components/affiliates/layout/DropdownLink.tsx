import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { MenuItem, SubMenu } from "react-pro-sidebar";

interface Props {
  activeName: string;
  collapseShow: boolean;
  dropdown: string;
  dropdownName: string;
  defaultLink: string;
  navbarName: string;
  parentLink: string;
  linkName: LinkName[];
  setactiveName: Dispatch<SetStateAction<string>>;
  setdropdown: Dispatch<SetStateAction<string>>;
  setCollapseShow: (value: boolean) => void;
}

interface LinkName {
  name: string;
  link: string;
}

const DropdownLink = ({
  setactiveName,
  setdropdown,
  setCollapseShow,
  activeName,
  collapseShow,
  dropdown,
  linkName,
  navbarName,
  dropdownName,
  parentLink,
  defaultLink,
}: Props) => {
  const activeLink = (value: string) => {
    setactiveName(value);
  };

  const activeDropdown = (value: string) => {
    setdropdown(value);
  };

  const activeDropdownVector = (value: boolean) => {
    setdropdownVector(value);
  };

  const activeOnLink = (value: boolean) => {
    setonLink(value);
  };

  const [dropdownVector, setdropdownVector] = useState(true);

  const [onLink, setonLink] = useState(false);

  useEffect(() => {
    console.log("dropdown");
    console.log(dropdown);
  }, [dropdown]);

  return (
    <>
      <SubMenu
        label={navbarName}
        icon={
          <Image
            alt="..."
            className="w-6 border-none pt-0.5 align-middle"
            height={50}
            width={50}
            src={
              "/img/icons/" +
              dropdownName +
              (dropdown == dropdownName && onLink ? "Active" : "") +
              ".png"
            }
          />
        }
      >
        {linkName.map((value, index) => (
          <div
            onClick={(e) => {
              console.log(`muly:link click ${value.link}`, {});
              e.preventDefault();
              activeOnLink(true);
              setactiveName(value.link);
              setCollapseShow(false);
            }}
            key={index}
          >
            <MenuItem
              component={
                <Link
                  href={
                    "/affiliates/" +
                    (parentLink == "" ? "" : parentLink + "/") +
                    value.link
                  }
                />
              }
            >
              <span
                className={
                  "ml-11 truncate text-base font-medium tracking-wide " +
                  (activeName == value.link ? "text-[#2262C6]" : "")
                }
              >
                {value.name}
              </span>
            </MenuItem>
          </div>
        ))}
      </SubMenu>
    </>
  );
};

export default DropdownLink;
