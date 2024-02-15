import { useState } from "react";

export const usePagination = <T>({
  pageSize,
  data,
}: {
  pageSize: number;
  data: T[];
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize);
  // Function to get current page's data
  const pageData = (): T[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // Function to go to a specific page
  const jumpToPage = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, totalPages));
  };

  return {
    pageData: pageData(),
    jumpToPage,
    currentPage,
    totalPages,
  };
};
