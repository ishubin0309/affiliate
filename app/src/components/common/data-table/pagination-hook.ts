import { useState } from "react";

interface PageParams {
  pageNumber: number;
  pageSize: number;
}

export const usePagination = () => {
  const [pageParams, setPageParams] = useState<PageParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  return { pageParams, setPageParams };
};
