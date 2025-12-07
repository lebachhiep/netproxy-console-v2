import { useTranslation } from 'react-i18next';
import { CaretLeft, CaretRight } from '../icons';
import { Select } from '../select/Select';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  type?: 'pagination' | 'loadmore';
  className?: string;
  // Load more specific props
  onLoadMore?: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

export function Pagination({
  current,
  total,
  pageSize,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  type = 'pagination',
  className = '',
  onLoadMore,
  loading = false,
  hasMore = true
}: PaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(total / pageSize);
  // const startItem = Math.min((current - 1) * pageSize + 1, total);
  // const endItem = Math.min(current * pageSize, total);

  // Nếu pageSize hiện tại không có trong options, thêm nó vào
  const sizeOptionsWithCurrent = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onChange?.(page, pageSize);
    }
  };

  const handleSizeChange = (newSize: number) => {
    onChange?.(1, newSize);
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    // Nếu ít hơn hoặc bằng 4 trang thì hiển thị hết
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Giữ 2 trang đầu động
    let start = current;
    let next = current + 1;

    // Nếu ở gần đầu thì vẫn bắt đầu từ 1
    if (current <= 1) {
      start = 1;
      next = 2;
    }

    // Nếu ở gần cuối thì hiển thị 2 trang cuối trước totalPages
    if (current >= totalPages - 1) {
      start = totalPages - 2;
      next = totalPages - 1;
    }

    pages.push(start, next);

    // Dấu ...
    if (next < totalPages - 1) {
      pages.push('...');
    }

    // Trang cuối
    pages.push(totalPages);

    return pages;
  };

  if (type === 'loadmore') {
    return (
      <div
        className={`bg-bg-primary dark:bg-bg-primary-dark px-4 py-2 shadow-md rounded-lg w-fit border-2 border-border-element dark:border-border-element-dark ${className}`}
      >
        <div className="flex items-center justify-center gap-4">
          {/* Left side - Show info and page size */}
          <div className="flex items-center text-sm  space-x-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-text-me dark:text-text-me-dark">Hiển thị</span>
              {showSizeChanger && (
                <>
                  <Select
                    options={sizeOptionsWithCurrent.map((size) => {
                      return {
                        label: <div>{size}</div>,
                        value: size
                      };
                    })}
                    className="h-6 rounded px-2 shadow-xs border-border w-12 hover:font-normal dark:pseudo-border-top dark:border-transparent"
                    value={pageSize}
                    onChange={(value) => handleSizeChange(value as number)}
                    placement="top"
                  />
                </>
              )}
              <div className="text-text-me dark:text-text-me-dark font-normal">
                trong <span className="text-text-hi dark:text-text-hi-dark font-bold">{total}</span> kết quả
              </div>
            </div>
          </div>

          {/* Right side - Load more button */}
          <div className="flex items-center space-x-4">
            {hasMore && (
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="inline-flex items-center bg-blue-600 text-blue text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:border-blue dark:hover:border-transparent"
              >
                {loading ? (
                  <>
                    <div className="border-2 border-border dark:border-border-dark rounded-[4px] shadow-xs px-2 h-7 py-1 font-bold underline">
                      Đang tải...
                    </div>
                  </>
                ) : (
                  <div className="border-2 border-border dark:border-border-dark rounded-[4px] shadow-xs px-2 h-7 py-1 font-bold underline">
                    Tải thêm
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`z-[100] ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Page info and size changer */}
        {/* <div className="hidden md:flex items-center text-sm text-text-me dark:text-text-me-dark space-x-4">
          <div>
            <span className="text-text-hi dark:text-text-hi-dark">
              {startItem}-{endItem}{' '}
            </span>
            trong <span className="text-text-hi dark:text-text-hi-dark">{total}</span> mục
          </div>
        </div> */}

        <div className="md:flex items-center ">
          <Select
            placeholder={current ? t('page') + ' ' + current : t('page')}
            optionClassName="gap-1 flex flex-col max-h-40 overflow-y-auto"
            options={Array(totalPages)
              .fill(null)
              .map((_, index) => {
                const size = index + 1;
                return {
                  label: (
                    <div key={size}>
                      {t('page')} {size}
                    </div>
                  ),
                  value: size
                };
              })}
            className="shadow-none h-8 rounded-lg border-border dark:border-transparent dark:pseudo-border-top w-[118px] font-medium hover:font-bold hover:border-blue dark:hover:border-transparent dark:pseudo-border-top"
            labelClassName="font-medium text-text-me hover:text-text-hi hover:font-bold"
            value={current}
            onChange={(value) => handlePageChange(value as number)}
            placement="top"
          />
        </div>

        {showSizeChanger && (
          <div className="flex md:hidden items-center">
            <Select
              options={pageSizeOptions.map((size) => {
                return {
                  label: <div>{size} / trang</div>,
                  value: size
                };
              })}
              className="shadow-none h-8 rounded-lg border-border dark:border-border-dark w-[118px] font-medium hover:font-bold dark:pseudo-border-top dark:hover:border-transparent dark:pseudo-border-top dark:border-transparent"
              labelClassName="font-medium text-text-me hover:text-text-hi hover:font-bold"
              value={pageSize}
              onChange={(value) => handleSizeChange(value as number)}
              placement="top"
            />
          </div>
        )}

        {/* Right side - Page navigation */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            className="shadow-xs bg-bg-primary dark:bg-bg-primary-dark dark:border-transparent dark:pseudo-border-top flex items-center justify-center min-h-8 min-w-8 border-2 border-border dark:border-border-dark rounded-lg font-medium hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:border-blue dark:hover:border-transparent "
            disabled={current <= 1}
            onClick={() => handlePageChange(current - 1)}
            title="Trang trước"
          >
            <CaretLeft className="" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-2">
            {generatePageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <button
                    key={`ellipsis-${index}`}
                    className="shadow-xs bg-bg-primary dark:border-transparent dark:pseudo-border-top dark:bg-bg-primary-dark min-w-8 min-h-8 rounded-lg text-text-me dark:text-text-me-dark text-sm 
                     border-2 border-border dark:border-border-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark
                     transition-all hover:border-blue dark:hover:border-transparent"
                  >
                    ...
                  </button>
                );
              }

              const isCurrentPage = page === current;
              return (
                <button
                  key={page}
                  className={`shadow-xs bg-bg-primary dark:bg-bg-primary-dark border-2 min-h-8 min-w-8 flex items-center justify-center text-sm rounded-lg font-medium transition-all ${
                    isCurrentPage
                      ? 'text-primary dark:text-primary-dark border border-primary dark:border-primary-dark'
                      : 'text-text-me dark:text-text-me-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark border-2 border-border dark:border-transparent dark:pseudo-border-top hover:border-blue dark:hover:border-transparent'
                  } `}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            className="shadow-xs bg-bg-primary dark:bg-bg-primary-dark flex items-center justify-center min-h-8 min-w-8 border-2 border-border dark:border-transparent dark:pseudo-border-top rounded-lg font-medium hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:border-blue dark:hover:border-transparent"
            disabled={current >= totalPages}
            onClick={() => handlePageChange(current + 1)}
            title="Trang sau"
          >
            <CaretRight className="" />
          </button>
        </div>
      </div>
    </div>
  );
}
