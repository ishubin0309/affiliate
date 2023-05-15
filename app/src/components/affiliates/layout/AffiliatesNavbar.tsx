import type { LanguageOption } from "@/components/Dropdowns/LanguageSelector";
import { LanguageSelector } from "@/components/Dropdowns/LanguageSelector";
import SelectUserDropdown from "@/components/Dropdowns/SelectUserDropdown";
import { languageDropDown } from "@/components/Dropdowns/languages-list";
import { SideMenuIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useProSidebar } from "react-pro-sidebar";
import NotificationDropDown from "../../Dropdowns/NotificationDropdown";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { api } from "@/utils/api";
import ImageWithFallback from "@/components/common/image-fallback";

interface Props {
  isDesktop: boolean;
  collapseShow: boolean;
  setCollapseShow: Dispatch<SetStateAction<boolean>>;
}

const AffiliatesNavbar = ({
  isDesktop,
  collapseShow,
  setCollapseShow,
}: Props) => {
  const router = useRouter();
  const { t, i18n } = useTranslation("affiliates");
  const language = router.locale || "en";
  const { data: config } = api.misc.getConfig.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  const logoPath = config?.logoPath;

  // const [selectLanguageItem, setSelectLanguageItem] =
  //   useState<LanguageOption | null>(null);
  const { collapseSidebar, toggleSidebar } = useProSidebar();

  const setSelectLanguageItem = async (language: string) => {
    const { pathname, asPath, query } = router;
    await router.push({ pathname, query }, asPath, { locale: language });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky left-0 top-0 z-10 flex max-h-[66px] w-full flex-row flex-nowrap items-center justify-start border-b-2 border-[#E7E7E7] bg-[#F5F8FA] p-2">
        <div className="mx-autp flex w-full flex-wrap items-center justify-between md:flex-nowrap ">
          <div className="flex-col items-center justify-center ">
            <div className="flex items-center">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  isDesktop ? collapseSidebar() : toggleSidebar();
                  setCollapseShow(!collapseShow);
                }}
              >
                <span
                  className={
                    "bg-blueGray-200 inline-flex h-12 w-12 -rotate-90 items-center justify-center text-sm text-white duration-300"
                  }
                >
                  <SideMenuIcon />
                </span>
              </a>

              <Link href="/">
                <span className="bg-blueGray-200 inline-flex h-10 w-16 items-center justify-center text-sm text-white md:h-12 md:w-32">
                  {/* <Image
                    src={logoPath ? logoPath : "/img/logo.png"}
                    width="90"
                    height="90"
                    alt="logo"
                  /> */}
                  <ImageWithFallback
                    src={logoPath ? logoPath : "/img/logo.png"}
                    fallbackSrc={"/img/logo.png"}
                    width="90"
                    height="90"
                    alt="logo"
                  />
                </span>
              </Link>

              <div className="hidden pl-16 lg:block">
                <span className="bg-blueGray-200 inline-flex h-8 w-10 items-center justify-center pr-2.5 text-sm text-white">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 h-fit rounded-full bg-primary p-1 hover:bg-primary"
                  >
                    <Facebook fill="#FFF" color="#FFF" className="h-5 w-5" />
                  </Button>
                </span>
                <span className="bg-blueGray-200 inline-flex h-8 w-10 items-center justify-center pr-2.5 text-sm text-white">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 h-fit rounded-full bg-primary p-1 hover:bg-primary"
                  >
                    <Instagram color="#FFF" className="h-5 w-5" />
                  </Button>
                </span>
                <span className="bg-blueGray-200 inline-flex h-8 w-10 items-center justify-center pr-2.5 text-sm text-white">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 h-fit rounded-full bg-primary p-1 hover:bg-primary"
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
              onLanguageChange={(language) => setSelectLanguageItem(language)}
              language={language}
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
