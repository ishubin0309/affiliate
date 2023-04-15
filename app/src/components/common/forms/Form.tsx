import { createTsForm } from "../../libs/react-ts-form";
import { mapping } from "./mapping";
import React from "react";
import { useSubmitAction } from "./useSubmitAction";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
export interface CommonFormProps {
  onSubmit: (values: unknown) => Promise<void>;
  children: React.ReactNode;

  submit?: {
    className?: string;
    text?: string;
    notification?: boolean;
  };
  link?: {
    linkText?: string;
    routePath?: string;
    className?: string;
  };

  className?: string;
}

const CommonForm = ({
  onSubmit,
  children,
  submit,
  link,

  className,
}: CommonFormProps) => {
  const {
    text,
    notification,
    className: buttonClassName,
  } = submit || {
    text: "Save",
    notification: false,
  };
  const {
    linkText,
    routePath = "/auth/lost-password",
    // className: buttonClassName,
  } = link || {
    text: "Save",
  };
  const { handleSubmit, isLoading } = useSubmitAction({
    onSubmit,
    notification,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col items-center">
        <div className={cn("mb-4 flex w-full flex-col gap-4", className)}>
          {children}
        </div>
        {link ? (
          <div className="mt-4 mb-4 flex w-full justify-end">
            <Link
              className="ml-1 inline-block font-bold "
              key={routePath}
              as={NextLink}
              href={routePath}
            >
              {linkText}
            </Link>
          </div>
        ) : null}

        <Button
          variant="primary"
          className={buttonClassName}
          isLoading={isLoading}
          type="submit"
        >
          {text}
        </Button>
      </div>
    </form>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Form = createTsForm(mapping, {
  FormComponent: CommonForm,
});
