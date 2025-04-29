import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  handlePageChange, 
  itemsPerPage, 
  setItemsPerPage, 
  totalItems,
  colors 
}) => {
  // calc display information
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = 1;
    let endPage = totalPages;
    
    if (totalPages > maxPagesToShow) {
      // calc start and end page based on current page
      const leftOffset = Math.floor(maxPagesToShow / 2);
      const rightOffset = maxPagesToShow - leftOffset - 1;
      
      if (currentPage <= leftOffset + 1) {
 
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - rightOffset) {
 
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
   
        startPage = currentPage - leftOffset;
        endPage = currentPage + rightOffset;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* items per page selector */}
      <div className="flex items-center gap-3 order-2 lg:order-1">
        <div className={`flex items-center gap-2 ${colors.cardBg} rounded-lg shadow-sm p-1.5`}>
          <label htmlFor="itemsPerPage" className={`hidden sm:inline text-sm font-medium ${colors.textMuted}`}>
            Rows per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className={`appearance-none px-2 py-1 rounded-md border-none ${colors.inputBg} ${colors.textColor} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-150`}
            aria-label="Items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        {/* showing entries  */}
        <div className={`text-sm ${colors.textMuted} hidden sm:block`}>
          <span className="font-medium">{startItem}</span>-<span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span>
        </div>
        
        {/* mobile view for entries */}
        <div className={`text-sm ${colors.textMuted} sm:hidden`}>
          {startItem}-{endItem}/{totalItems}
        </div>
      </div>
      
      {/* pagination controls */}
      <div className="flex justify-center items-center order-1 lg:order-2">
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          {/* first page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-l-md px-2.5 py-2 ${
              currentPage === 1 
                ? `${colors.textMuted} cursor-not-allowed` 
                : `${colors.textColor} hover:${colors.tableHover.replace('hover:', '')} focus:z-20 focus:outline-offset-0 focus:ring-2 focus:ring-blue-500`
            } transition-all duration-150`}
          >
            <span className="sr-only">First Page</span>
            <ChevronsLeft size={16} />
          </button>
          
          {/* previous page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2.5 py-2 ${
              currentPage === 1 
                ? `${colors.textMuted} cursor-not-allowed` 
                : `${colors.textColor} hover:${colors.tableHover.replace('hover:', '')} focus:z-20 focus:outline-offset-0 focus:ring-2 focus:ring-blue-500`
            } transition-all duration-150`}
          >
            <span className="sr-only">Previous Page</span>
            <ChevronLeft size={16} />
          </button>
          
          {/* page numbers */}
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              aria-current={currentPage === pageNum ? "page" : undefined}
              className={`relative hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium ${
                currentPage === pageNum 
                  ? `${colors.buttonPrimary} text-white z-10 focus:z-20` 
                  : `${colors.textColor} hover:${colors.tableHover.replace('hover:', '')} focus:z-20 focus:outline-offset-0 focus:ring-2 focus:ring-blue-500`
              } transition-all duration-150`}
            >
              {pageNum}
            </button>
          ))}
          
          {/* current page indicator for mobile */}
          <span className={`relative sm:hidden inline-flex items-center px-4 py-2 text-sm font-medium ${colors.textColor}`}>
            {currentPage} / {totalPages}
          </span>
          
          {/* next page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2.5 py-2 ${
              currentPage === totalPages 
                ? `${colors.textMuted} cursor-not-allowed` 
                : `${colors.textColor} hover:${colors.tableHover.replace('hover:', '')} focus:z-20 focus:outline-offset-0 focus:ring-2 focus:ring-blue-500`
            } transition-all duration-150`}
          >
            <span className="sr-only">Next Page</span>
            <ChevronRight size={16} />
          </button>
          
          {/* last page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center rounded-r-md px-2.5 py-2 ${
              currentPage === totalPages 
                ? `${colors.textMuted} cursor-not-allowed` 
                : `${colors.textColor} hover:${colors.tableHover.replace('hover:', '')} focus:z-20 focus:outline-offset-0 focus:ring-2 focus:ring-blue-500`
            } transition-all duration-150`}
          >
            <span className="sr-only">Last Page</span>
            <ChevronsRight size={16} />
          </button>
        </nav>
      </div>
      
      {/* total transactions count (RIGHT) */}
      <div className={`text-sm font-medium ${colors.textColor} order-3 lg:order-3 flex items-center gap-2`}>
        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full ${colors.buttonPrimary} text-white text-xs`}>
          {totalItems}
        </span>
        <span>Total Transactions</span>
      </div>
    </div>
  );
};

export default Pagination;