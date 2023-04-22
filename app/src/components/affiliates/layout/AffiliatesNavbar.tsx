import type { LanguageOption } from "@/components/Dropdowns/LanguageSelector";
import { LanguageSelector } from "@/components/Dropdowns/LanguageSelector";
import SelectUserDropdown from "@/components/Dropdowns/SelectUserDropdown";
import { languageDropDown } from "@/components/Dropdowns/languages-list";
import { SideMenuIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Image } from "@chakra-ui/react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import NotificationDropDown from "../../Dropdowns/NotificationDropdown";

interface Props {
  collapseShow: boolean;
  setCollapseShow: Dispatch<SetStateAction<boolean>>;
}

const AffiliatesNavbar = ({ collapseShow, setCollapseShow }: Props) => {
  const [selectLanguageItem, setSelectLanguageItem] =
    useState<LanguageOption | null>(null);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky left-0 top-0 z-10 flex w-full flex-row flex-nowrap items-center justify-start border-b-2 border-[#E7E7E7] bg-[#F5F8FA] p-2 md:p-4">
        <div className="mx-autp flex w-full flex-wrap items-center justify-between md:flex-nowrap ">
          <div className="flex-col items-center justify-center ">
            <div className="flex items-center">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setCollapseShow(!collapseShow);
                }}
              >
                <span
                  className={
                    (collapseShow ? "-rotate-90 " : "rotate-0 ") +
                    "bg-blueGray-200 inline-flex h-12 w-12 items-center justify-center text-sm text-white duration-300"
                  }
                >
                  <SideMenuIcon />
                </span>
              </a>

              <Link href="/">
                <span className="bg-blueGray-200 inline-flex h-10 w-20 items-center justify-center text-sm text-white md:h-12 md:w-32">
                  <Image src="/img/logo.png" htmlWidth="90" alt="logo" />
                </span>
              </Link>

              <div className="hidden pl-16 md:block">
                <span className="bg-blueGray-200 inline-flex h-8 w-10 items-center justify-center pr-2.5 text-sm text-white">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 h-8 rounded-full bg-primary p-1"
                  >
                    <Facebook fill="#FFF" color="#FFF" className="h-5 w-5" />
                  </Button>
                </span>
                <span className="bg-blueGray-200 inline-flex h-8 w-10 items-center justify-center pr-2.5 text-sm text-white">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 h-8 rounded-full bg-primary p-1"
                  >
                    <Instagram color="#FFF" className="h-5 w-5" />
                  </Button>
                </span>
                <span className="bg-blueGray-200 inline-flex h-8 w-10 items-center justify-center pr-2.5 text-sm text-white">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 h-8 rounded-full bg-primary p-1"
                  >
                    <Twitter fill="#FFF" color="#FFF" className="h-5 w-5" />
                  </Button>
                </span>
              </div>
            </div>
          </div>
          {/* User */}
          <ul className="flex list-none flex-row items-center">
            <LanguageSelector
              onLanguageChange={(val) => setSelectLanguageItem(val)}
              selectedOption={selectLanguageItem}
              options={languageDropDown}
            />
            <NotificationDropDown />
            <SelectUserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
};

export default AffiliatesNavbar;
