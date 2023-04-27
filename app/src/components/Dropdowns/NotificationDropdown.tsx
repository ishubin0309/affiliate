import { createPopper } from "@popperjs/core";
import { Bell } from "lucide-react";
import React from "react";

const NotificationDropDown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef: any = React.createRef();
  const popoverDropdownRef: any = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [-180, 10],
          },
        },
      ],
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <div className="border-blueGray-100 h-10 border border-solid md:mx-1" />
      <a
        className="text-blueGray-500 block px-1 md:px-4"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="flex items-center">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm text-white">
            <Bell className="h-6 w-6" color="#303134" />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "min-w-56 z-50 float-left list-none rounded bg-white py-2 text-left text-base shadow-lg"
        }
      >
        <div className="w-60 px-4 py-2 text-sm font-normal">
          <p className="text-black">
            You got comission{" "}
            <span className="font-medium text-[#2262C6]">$ 1,521</span>
          </p>
          <p className="mt-1 text-[#757575]">22 Feb 2023</p>
        </div>
        <div className="w-60 px-4 py-2 text-sm font-normal">
          <p className="text-black">
            You got comission{" "}
            <span className="font-medium text-[#2262C6]">$ 1,521</span>
          </p>
          <p className="mt-1 text-[#757575]">22 Feb 2023</p>
        </div>
      </div>
    </>
  );
};

export default NotificationDropDown;
