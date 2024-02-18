import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Determine the range of numbers to show around the current page
  const sideNumbers = 4; // numbers to show on each side of the current page
  let start = Math.max(currentPage - sideNumbers, 1);
  let end = Math.min(currentPage + sideNumbers, totalPages);

  // Adjust start and end if near the beginning or end
  if (currentPage <= 3) {
    end = 1 + sideNumbers * 2;
  }
  if (currentPage > totalPages - 3) {
    start = totalPages - sideNumbers * 2;
  }

  // Ensure start and end are within bounds
  start = Math.max(start, 1);
  end = Math.min(end, totalPages);

  // Generate page numbers
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="m-auto flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-1"
      >
        <IoIosArrowBack size={16} color={currentPage <= 1 ? "grey" : "white"} />
      </button>

      {start > 1 && <button onClick={() => onPageChange(1)}>1</button>}
      {start > 2 && <span>...</span>}
      {pages.map((page) => (
        <button
          key={page}
          style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {end < totalPages - 1 && <span>...</span>}
      {end < totalPages && (
        <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-1"
      >
        <IoIosArrowForward
          size={16}
          color={currentPage >= totalPages ? "grey" : "white"}
        />
      </button>
    </div>
  );
};

export default Pagination;
