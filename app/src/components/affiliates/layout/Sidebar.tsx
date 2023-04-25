import {
  navigationData,
  type NavigationLinkData,
} from "@/components/affiliates/layout/navigation-data";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Menu,
  menuClasses,
  sidebarClasses,
  Sidebar as SideMenu,
} from "react-pro-sidebar";
import DropdownLink from "./DropdownLink";
import SingleLink from "./SingleLink";

interface Props {
  collapseShow: boolean;
  tempCollapseShow: boolean;
  setTempCollapseShow: (value: boolean) => void;
}

const renderLink = (
  item: NavigationLinkData,
  index: number,
  setActiveName: React.Dispatch<React.SetStateAction<string>>,
  setDropdown: React.Dispatch<React.SetStateAction<string>>,
  activeName: string,
  dropdown: string,
  collapseShow: boolean,
  setCollapseShow: (value: boolean) => void
) => {
  if (item.type === "single") {
    return (
      <SingleLink
        setactiveName={setActiveName}
        setdropdown={setDropdown}
        activeName={activeName}
        collapseShow={collapseShow}
        setCollapseShow={setCollapseShow}
        link={item.link}
        linkName={item.linkName}
      />
    );
  } else if (item.type === "dropdown") {
    return (
      <DropdownLink
        setactiveName={setActiveName}
        setCollapseShow={setCollapseShow}
        setdropdown={setDropdown}
        dropdown={dropdown}
        activeName={activeName}
        collapseShow={collapseShow}
        linkName={item.links}
        defaultLink={item.defaultLink}
        dropdownName={item.dropdownName}
        navbarName={item.linkName}
        parentLink={item.parentLink || ""}
      />
    );
  }
};

const Sidebar: React.FC<Props> = ({
  collapseShow,
  tempCollapseShow,
  setTempCollapseShow,
}) => {
  const [activeName, setActiveName] = React.useState("dashboard");
  const [dropdown, setDropdown] = React.useState("");

  const sidebarClassName = cn(
    tempCollapseShow ? "md:rounded-none" : "",
    "sidebar fixed top-16 left-0 z-10 flex h-full flex-col bg-white transition-all duration-300 dark:bg-gray-900 md:top-20 scrollbar-thin"
  );

  return (
    <div className={sidebarClassName}>
      <div className="flex grow flex-col justify-between overflow-y-auto overflow-x-hidden">
        <div className="scrollbar-thin relative min-h-full space-y-1 overflow-y-auto">
          <SideMenu
            breakPoint="md"
            className="scrollbar-thin pt-16 md:pt-0"
            rootStyles={{
              [`.${sidebarClasses.container}`]: {
                backgroundColor: "#fff",
              },
              ["." + menuClasses.subMenuContent]: {
                width: "280px",
              },
            }}
            width="280px"
          >
            <Menu>
              {navigationData.map((item, index) =>
                renderLink(
                  item,
                  index,
                  setActiveName,
                  setDropdown,
                  activeName,
                  dropdown,
                  tempCollapseShow,
                  setTempCollapseShow
                )
              )}
            </Menu>
          </SideMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
