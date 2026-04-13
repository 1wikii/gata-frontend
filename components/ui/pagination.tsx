import React from "react";

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  /**
   * Optional: berapa item halaman yang ingin ditampilkan di tengah (default 5).
   * Jika totalPages <= windowSize maka semua nomor akan ditampilkan.
   */
  windowSize?: number;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  windowSize = 5,
}: PaginationSectionProps) {
  // hitung range page yang akan ditampilkan (centered window)
  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= windowSize) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const half = Math.floor(windowSize / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = windowSize;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - windowSize + 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPageNumbers();

  const onPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const onNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="bg-white border-l border-r border-b border-gray-200 rounded-b-lg">
      <div className="flex items-center justify-between p-4">
        {/* Info text kiri */}
        <div className="text-sm text-gray-600">
          Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari{" "}
          {totalItems} data
        </div>

        {/* Pagination kanan */}
        <div className="flex items-center space-x-3">
          {/* Tombol Sebelumnya */}
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                currentPage === 1
                  ? "text-blue-200 border border-blue-200 bg-white cursor-not-allowed"
                  : "text-blue-600 border border-blue-200 bg-white hover:bg-blue-50"
              }`}
            aria-label="Sebelumnya"
          >
            Sebelumnya
          </button>

          {/* Nomor halaman */}
          <div className="inline-flex items-center space-x-2">
            {pages[0] > 1 && (
              <>
                <PageButton
                  page={1}
                  isActive={1 === currentPage}
                  onClick={onPageChange}
                />
                {pages[0] > 2 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </>
            )}

            {pages.map((p) => (
              <PageButton
                key={p}
                page={p}
                isActive={p === currentPage}
                onClick={onPageChange}
              />
            ))}

            {pages[pages.length - 1] < totalPages && (
              <>
                {pages[pages.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <PageButton
                  page={totalPages}
                  isActive={totalPages === currentPage}
                  onClick={onPageChange}
                />
              </>
            )}
          </div>

          {/* Tombol Selanjutnya */}
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                currentPage === totalPages
                  ? "text-blue-200 border border-blue-200 bg-white cursor-not-allowed"
                  : "text-blue-600 border border-blue-200 bg-white hover:bg-blue-50"
              }`}
            aria-label="Selanjutnya"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

/* Komponen kecil untuk tombol halaman */
function PageButton({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: (page: number) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick(page);
      }}
      className={`w-9 h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition
        ${
          isActive
            ? "bg-blue-600 text-white shadow"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </button>
  );
}
