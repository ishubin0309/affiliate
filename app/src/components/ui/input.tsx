import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: any;
}

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <>
        <input
          className={cn(
            "h- flex w-max rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
            { "border-red-300": error },
            className
          )}
          ref={ref}
          {...props}
        />
      </>
    );
  }
);

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn("mb-2 block text-sm font-bold text-gray-700", className)}
        htmlFor="password"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
Label.displayName = "Label";

export { Input, Label };
