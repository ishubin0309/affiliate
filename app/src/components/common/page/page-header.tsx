import { Breadcrumb } from "@/components/common/page/breadcrumb";
import React from "react";

interface Props {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ children, title, subTitle }: Props) => {
  return (
    <div className="my-3 flex flex-row items-center justify-between">
      <Breadcrumb title={title} subTitle={subTitle} />
      <div className="flex flex-row gap-2 px-4">{children}</div>
    </div>
  );
};
