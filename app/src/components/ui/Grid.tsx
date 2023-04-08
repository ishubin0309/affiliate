import React from "react";

interface Props {
  columns: number;
  gaps: number;
  className?: string;
  children: any;
}

const Grid = React.forwardRef<HTMLBodyElement, Props>(
  ({ className, children, ...props }) => {
    console.log("props ----->", props);
    return <div className={`grid grid grid-cols-4 gap-2`}>{children}</div>;
  }
);

Grid.displayName = "Grid";

export { Grid };
