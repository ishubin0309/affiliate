import { Breadcrumb } from "@/components/common/page/breadcrumb";
import React from "react";

interface Props {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ children, title, subTitle }: Props) => {
  return (
    <div className="mt-3 flex-row items-center justify-between md:flex">
      <Breadcrumb title={title} subTitle={subTitle} />
      <div className="mb-3 flex flex-row gap-2">{children}</div>
    </div>
  );
};
