<<<<<<< HEAD
//import { Image } from "@chakra-ui/react";
=======
>>>>>>> 71b57f8f0109fe5d5634328c31ec19ddfd574e6c
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { MenuItem } from "react-pro-sidebar";

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
      }}
    >
      <MenuItem
        component={<Link href={"/affiliates/" + link} />}
        icon={
          <Image
            alt="dashboard"
            width={25}
            height={25}
            className="w-6 border-none pt-0.5 align-middle"
            height={50}
            width={50}
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
            "ml-4 truncate text-base font-medium tracking-wide " +
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
