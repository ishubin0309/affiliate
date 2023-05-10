import { useState } from "react";

interface PageParams {
  pageNumber: number;
  pageSize: number;
}

export const usePagination = (defaultPageSize = 10) => {
  const [pageParams, setPageParams] = useState<PageParams>({
    pageNumber: 1,
    pageSize: defaultPageSize,
  });

  return { pageParams, setPageParams };
};
