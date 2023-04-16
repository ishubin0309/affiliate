import { Home } from "lucide-react";
import React from "react";

interface Props {
  title: string;
  subTitle?: string;
}

export const Breadcrumb = ({ title, subTitle }: Props) => {
  return (
    <div className="flex items-center px-4 text-base font-medium">
      <Home />
      <span>&nbsp;/&nbsp;{title}</span>
      {!!subTitle && <span>&nbsp;/&nbsp;{subTitle}</span>}
    </div>
  );
};
