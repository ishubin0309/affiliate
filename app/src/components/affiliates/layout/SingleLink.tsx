import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { MenuItem, useProSidebar } from "react-pro-sidebar";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  activeName: string;
  collapseShow: boolean;
  setCollapseShow: (value: boolean) => void;
  setactiveName: Dispatch<SetStateAction<string>>;
  setdropdown: Dispatch<SetStateAction<string>>;
  link: string;
  linkName: string;
}

const SingleLink = ({
  setactiveName,
  setdropdown,
  activeName,
  collapseShow,
  setCollapseShow,
  link,
  linkName,
}: Props) => {
  const { toggleSidebar } = useProSidebar();
  const desktop = useMediaQuery("(min-width: 768px)");

  const activeLink = (value: string) => {
    setactiveName(value);
  };

  const activeDropdown = (value: string) => {
    setdropdown(value);
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        activeLink(link);
        activeDropdown("");
        setCollapseShow(false);
        if (!desktop) {
          toggleSidebar();
        }
      }}
    >
      <MenuItem
        component={<Link href={"/affiliates/" + link} />}
        icon={
          <Image
            alt="..."
            width={25}
            height={25}
            className="w-6 border-none pt-0.5 align-middle"
            src={
              "/img/icons/" +
              link +
              (activeName == link ? "Active" : "") +
              ".png"
            }
          />
        }
      >
        <span
          className={
            "truncate text-base font-medium tracking-wide " +
            (activeName == link ? "text-[#2262C6]" : "")
          }
        >
          {linkName}
        </span>
      </MenuItem>
    </div>
  );
};

export default SingleLink;
