import React, { useRef } from 'react';
import { Checkbox } from '../checkbox/Checkbox';
import { Pagination, PaginationProps } from '../pagination/Pagination';
import { ExpandMore } from '../icons';
import clsx from 'clsx';

export interface TableColumn<T> {
  /** Key của column, có thể là string hoặc path object */
  key: keyof T | string;

  /** Tiêu đề cột */
  title: React.ReactNode;

  /** Render custom cell */
  render?: (value: any, record: T, index: number) => React.ReactNode;

  /** Chiều rộng column */
  width?: string | number;

  /** Căn chỉnh text */
  align?: 'left' | 'center' | 'right';

  /** Có thể sort cột */
  sortable?: boolean;

  /** Có thể filter cột */
  filterable?: boolean;

  /** Column cố định bên trái hoặc phải */
  fixed?: 'left' | 'right';

  /** Chiều rộng tối thiểu */
  minWidth?: string | number;
}

export interface TableProps<T> {
  /** Dữ liệu bảng */
  data: T[];

  /** Cấu hình cột của bảng */
  columns: TableColumn<T>[];

  /** Hiển thị loading spinner */
  loading?: boolean;

  /** Kiểu pagination: 'pagination' hoặc 'loadmore' */
  paginationType?: 'pagination' | 'loadmore';

  /** Cấu hình pagination */
  pagination?: PaginationProps;

  /** Cấu hình row selection */
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };

  /** Callback khi click vào row */
  onRowClick?: (record: T, index: number) => void;

  /** Class tùy chỉnh cho wrapper bảng */
  className?: string;

  /** Kích thước chữ: 'small', 'middle', 'large' */
  size?: 'small' | 'middle' | 'large';

  /** Hiển thị border xung quanh bảng */
  bordered?: boolean;

  /** Hiển thị header */
  showHeader?: boolean;

  /** Header cố định khi scroll */
  fixedHeader?: boolean;

  /** Scroll container */
  scroll?: { x?: number | string; y?: number | string };

  /** ClassName cho từng row */
  rowClassName?: (record: T, index: number) => string;

  /** Style cho từng row */
  rowStyle?: (record: T, index: number) => React.CSSProperties;
  /** Sort field hiện tại - CONTROLLED */
  sortField?: string | null;

  /** Sort order hiện tại - CONTROLLED */
  sortOrder?: 'asc' | 'desc' | null;

  /** Callback khi sort thay đổi - CONTROLLED */
  onSort?: (field: string | null, order: 'asc' | 'desc' | null) => void;

  /** Hiển thị đủ số dòng theo pageSize (bao gồm dòng trống) */
  showEmptyRows?: boolean;

  maxHeight?: string;
  bodyClassName?: string;
}

/**
 * Component Table
 *
 * Bảng dữ liệu linh hoạt với các tính năng:
 * - Hỗ trợ hiển thị dữ liệu dạng rows & columns
 * - Hỗ trợ scroll ngang/dọc với fixed header và fixed columns
 * - Hỗ trợ sort, filter, align, minWidth, width, fixed left/right
 * - Hỗ trợ rowSelection với checkbox (select all / select row)
 * - Hỗ trợ click vào row
 * - Hỗ trợ pagination kiểu "pagination" hoặc "load more"
 * - Hỗ trợ custom rowClassName, rowStyle
 * - Hỗ trợ các kích thước: small, middle, large
 * - Hỗ trợ bordered table
 * - Hỗ trợ hiển thị đủ số dòng theo pageSize (showEmptyRows)
 *
 * @component
 *
 * @example
 * interface DataType {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 *
 * const columns: TableColumn<DataType>[] = [
 *   { key: 'id', title: 'ID', width: 50 },
 *   { key: 'name', title: 'Tên', sortable: true },
 *   { key: 'age', title: 'Tuổi', align: 'right' }
 * ];
 *
 * <Table
 *   data={data}
 *   columns={columns}
 *   rowSelection={{
 *     selectedRowKeys,
 *     onChange: (keys, rows) => setSelectedRows(rows)
 *   }}
 *   pagination={{
 *     current: 1,
 *     pageSize: 10,
 *     total: 100,
 *     onChange: (page, size) => console.log(page, size)
 *   }}
 *   showEmptyRows={true}
 * />
 *
 */
export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  rowSelection,
  onRowClick,
  className = '',
  size = 'middle',
  bordered = false,
  showHeader = true,
  fixedHeader = true,
  scroll,
  rowClassName,
  rowStyle,
  paginationType = 'loadmore',
  // CONTROLLED SORTING PROPS
  sortField = null,
  sortOrder = null,
  onSort,
  showEmptyRows = false,
  maxHeight,
  bodyClassName
}: TableProps<T>) {
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base'
  };

  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    if (sortField === columnKey) {
      const newOrder = sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc';
      onSort(newOrder ? columnKey : null, newOrder);
    } else {
      onSort(columnKey, 'asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;
    const allKeys = data.map((_, index) => index);
    rowSelection.onChange(checked ? allKeys : [], checked ? data : []);
  };

  const handleSelectRow = (key: string | number, record: T, checked: boolean) => {
    if (!rowSelection) return;
    const newSelectedKeys = checked ? [...rowSelection.selectedRowKeys, key] : rowSelection.selectedRowKeys.filter((k) => k !== key);
    const newSelectedRows = data.filter((_, index) => newSelectedKeys.includes(index));
    rowSelection.onChange(newSelectedKeys, newSelectedRows);
  };

  // Sync scroll between header and body
  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number): React.ReactNode => {
    const value =
      typeof column.key === 'string' && column.key.includes('.')
        ? column.key.split('.').reduce((obj, key) => obj?.[key], record)
        : record[column.key as keyof T];

    if (column.render) return column.render(value, record, index);
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value == null) return null;
    return JSON.stringify(value);
  };

  const isAllSelected = rowSelection && rowSelection.selectedRowKeys.length === data.length;
  const isIndeterminate = rowSelection && rowSelection.selectedRowKeys.length > 0 && !isAllSelected;

  // Tính toán width cho columns
  const getColumnWidth = (column: TableColumn<T>) => {
    if (column.width) {
      // Nếu có width -> giữ nguyên (cứng)
      return typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    // Nếu không có width -> auto (hoặc fallback minWidth nếu có)
    if (column.minWidth) {
      return typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
    }
    return 'auto'; // để auto thay vì 150px cứng
  };

  // Tính left offset cho sticky columns bên trái
  const leftFixedColumns = columns.filter((col) => col.fixed === 'left');
  const rightFixedColumns = columns.filter((col) => col.fixed === 'right');

  const getLeftOffset = (columnIndex: number) => {
    const column = columns[columnIndex];
    if (column.fixed !== 'left') return 0;

    let offset = rowSelection ? 48 : 0; // checkbox column width
    for (let i = 0; i < columnIndex; i++) {
      if (columns[i].fixed === 'left') {
        const width = getColumnWidth(columns[i]);
        offset += parseInt(width.replace('px', ''));
      }
    }
    return offset;
  };

  // Tính right offset cho sticky columns bên phải
  const getRightOffset = (columnIndex: number) => {
    const column = columns[columnIndex];
    if (column.fixed !== 'right') return 0;

    let offset = 0;
    for (let i = columnIndex + 1; i < columns.length; i++) {
      if (columns[i].fixed === 'right') {
        const width = getColumnWidth(columns[i]);
        offset += parseInt(width.replace('px', ''));
      }
    }
    return offset;
  };

  // Tính tổng width của table để đảm bảo scroll hoạt động
  const getTotalWidth = () => {
    let totalWidth = rowSelection ? 48 : 0;
    columns.forEach((col) => {
      const width = getColumnWidth(col);
      totalWidth += parseInt(width.replace('px', ''));
    });
    return totalWidth;
  };

  const totalTableWidth = getTotalWidth();
  const scrollX = scroll?.x;
  const tableMinWidth = scrollX ? (typeof scrollX === 'number' ? `${scrollX}px` : scrollX) : `${totalTableWidth}px`;

  // Tính toán dữ liệu hiển thị
  const getDisplayData = () => {
    if (!showEmptyRows || !pagination) {
      return data;
    }

    // Tính toán dữ liệu cho trang hiện tại
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    // Tạo mảng đủ pageSize dòng, các dòng không có data sẽ là null
    const fullPageData = Array.from({ length: pagination.pageSize }, (_, index) => {
      return index < paginatedData.length ? paginatedData[index] : null;
    });

    return fullPageData;
  };

  const displayData = getDisplayData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  // Render Header Table
  const renderHeaderTable = () => (
    <div
      ref={headerScrollRef}
      className={clsx("overflow-auto relative bg-bg-canvas border-border-element dark:border-border-element-dark border-b-2 border-t-2 dark:bg-bg-canvas-dark")}
      style={{
        overflowX: 'hidden',
        overflowY: scroll?.y ? 'scroll' : 'visible',
        scrollbarGutter: 'stable'
      }}
    >
      <table
        className={`px-5 shadow-xs ${sizeClasses[size]} ${bordered ? 'border-l-2 border-r-2 border-border-element dark:border-border-element-dark' : ''}`}
        style={{
          tableLayout: 'fixed',
          minWidth: tableMinWidth,
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0px'
        }}
      >
        <thead className="z-20">
          <tr>
            {rowSelection && (
              <th className="w-12 h-8 px-2 py-1 text-left sticky left-0 z-30 bg-bg-canvas dark:bg-bg-canvas-dark">
                <div className="flex items-center justify-center px-2 gap-1 border-r-[1.25px] border-border-element dark:border-border-element-dark h-full">
                  <Checkbox indeterminate={isIndeterminate} checked={!!isAllSelected} onChange={(checked) => handleSelectAll(checked)} />
                </div>
              </th>
            )}

            {columns.map((col, colIndex) => {
              const leftOffset = getLeftOffset(colIndex);
              const rightOffset = getRightOffset(colIndex);
              const isLeftFixed = col.fixed === 'left';
              const isRightFixed = col.fixed === 'right';
              const isLastCol = colIndex === columns.length - 1;
              const isSorted = sortField === col.key; // Check if this column is being sorted

              // align cho text
              let alignClass = 'text-left';
              let justifyClass = 'justify-start';
              if (col.align === 'center') {
                alignClass = 'text-center';
                justifyClass = 'justify-center';
              }
              if (col.align === 'right') {
                alignClass = 'text-right';
                justifyClass = 'justify-end';
              }
              if (col.sortable) {
                justifyClass = 'justify-between';
              }

              let thClassName = `h-9 py-1 ${alignClass} text-sm font-medium text-text-lo dark:text-text-lo-dark
  ${col.sortable ? 'cursor-pointer !text-text-hi dark:!text-text-hi-dark' : ''} 
  bg-bg-canvas dark:bg-bg-canvas-dark`;

              let className = `h-8 ${alignClass} text-sm font-medium text-text-lo dark:text-text-lo-dark
  ${col.sortable ? 'cursor-pointer hover:!text-text-hi dark:hover:!text-text-hi-dark' : ''} 
  bg-bg-canvas dark:bg-bg-canvas-dark`;

              // THÊM FONT-WEIGHT CHO CỘT ĐANG SORT
              if (isSorted) {
                thClassName += ' font-medium'; // font-weight: 500
              } else {
                thClassName += ' font-normal'; // font-weight: 400
              }

              if (isLeftFixed) {
                thClassName += ' sticky z-30 bg-white';
                const isLastLeftFixed = leftFixedColumns[leftFixedColumns.length - 1] === col;
                if (isLastLeftFixed) {
                  thClassName += ' shadow-table';
                }
              } else if (isRightFixed) {
                thClassName += ' sticky z-30';
                const isFirstRightFixed = rightFixedColumns[0] === col;
                if (isFirstRightFixed) {
                  thClassName += ' fixed-right-shadow';
                }
              }

              const colWidth = getColumnWidth(col);

              const style: React.CSSProperties = {
                width: colWidth,
                minWidth: colWidth
              };

              if (isLeftFixed) style.left = leftOffset;
              if (isRightFixed) style.right = rightOffset;
              // Border className cho div bên trong
              let borderClassName = '';
              // Chỉ thêm border-right cho các cột không phải cuối, kế cuối và không phải fixed
              const isSecondLastCol = colIndex === columns.length - 2;
              if (!isLastCol && !isSecondLastCol && !isLeftFixed && !isRightFixed) {
                borderClassName += 'border-r-[1.25px] border-border-element dark:border-border-element-dark ';
              }

              return (
                <th key={colIndex} className={thClassName} style={style} onClick={() => col.sortable && handleSort(col.key as string)}>
                  <div className={className}>
                    <div className={`flex items-center px-2 gap-1 ${justifyClass} ${borderClassName} h-full`}>
                      <span>{col.title}</span>

                      {col.sortable && (
                        <div className="flex items-center justify-center w-5 h-5">
                          <ExpandMore className="w-5 h-5 hover:text-text-hi dark:hover:text-text-hi-dark" />
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
      </table>
    </div>
  );

  // Render Body Table
  const renderBodyTable = () => (
    <div
      ref={bodyScrollRef}
      className="overflow-auto hide-scroll-x relative flex-1 dark:bg-bg-canvas-dark z-50"
      style={{
        maxHeight: maxHeight || '',
        overflowX: 'auto',
        overflowY: scroll?.y ? 'scroll' : 'visible'
      }}
      onScroll={handleBodyScroll}
    >
      <table
        className={`px-5 dark:bg-bg-canvas-dark ${sizeClasses[size]} ${bordered ? 'border-l-2 border-r-2 border-border-element dark:border-border-element-dark' : ''}`}
        style={{
          tableLayout: 'fixed',
          minWidth: tableMinWidth,
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0px'
        }}
      >
        <tbody className={bodyClassName}>
          {displayData.map((record, rowIndex) => {
            // Tính chỉ số thực tế trong toàn bộ data
            const actualRowIndex = showEmptyRows && pagination ? (pagination.current - 1) * pagination.pageSize + rowIndex : rowIndex;

            const isSelected = rowSelection?.selectedRowKeys.includes(actualRowIndex);
            const isEmpty = record === null; // Dòng trống

            // Row className: kết hợp cursor, hover, selection, custom
            const rowClass = `${rowIndex % 2 === 0 ? 'bg-bg-canvas dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'} ${!isEmpty && onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${!isEmpty ? rowClassName?.(record, actualRowIndex) || '' : ''}`;

            // Row style: chẵn/lẻ + selection + custom
            const rowStyleFinal: React.CSSProperties = {
              ...(!isEmpty ? rowStyle?.(record, actualRowIndex) : {})
            };

            return (
              <tr
                key={actualRowIndex}
                className={rowClass}
                style={rowStyleFinal}
                onClick={() => !isEmpty && onRowClick?.(record, actualRowIndex)}
              >
                {rowSelection && (
                  <td
                    className={`rounded-l-lg w-12 px-2 py-1 sticky left-0 z-10 ${rowClass}`}
                    style={{
                      ...rowStyleFinal
                    }}
                  >
                    {!isEmpty && (
                      <Checkbox checked={!!isSelected} onChange={(checked) => handleSelectRow(actualRowIndex, record, checked)} />
                    )}
                  </td>
                )}

                {columns.map((col, colIndex) => {
                  const leftOffset = getLeftOffset(colIndex);
                  const rightOffset = getRightOffset(colIndex);
                  const isLeftFixed = col.fixed === 'left';
                  const isRightFixed = col.fixed === 'right';
                  const isSorted = sortField === col.key;

                  // Xác định cell đầu và cuối
                  const isFirstCell = colIndex === 0 && !rowSelection;
                  const isLastCell = colIndex === columns.length - 1;

                  let className = `${rowClass} text-sm px-2 py-2 h-12 text-text-hi dark:text-text-hi-dark text-${col.align || 'left'} ${bordered ? 'border-r border-border-element dark:border-border-element-dark' : ''}`;

                  // if (!isLeftFixed && !isRightFixed) {
                  //   className += ' truncate';
                  // }

                  if (isSorted) {
                    className += ' font-medium';
                  }

                  // Thêm border radius cho cell đầu tiên
                  if (isFirstCell) {
                    className += ' rounded-l-lg'; // Border radius trái
                  }

                  // Thêm border radius cho cell cuối cùng
                  if (isLastCell) {
                    className += ' rounded-r-lg'; // Border radius phải
                  }

                  if (isLeftFixed) {
                    className += ' sticky z-10';
                    const isLastLeftFixed = leftFixedColumns[leftFixedColumns.length - 1] === col;
                    if (isLastLeftFixed) {
                      className += ` shadow-table dark:shadow-table-dark ${rowIndex % 2 === 0 ? 'dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'}`;
                    }
                  }
                  if (isRightFixed) {
                    className += ' sticky z-10';
                    const isFirstRightFixed = rightFixedColumns[0] === col;
                    if (isFirstRightFixed) {
                      className += ` h-full fixed-right-shadow  ${rowIndex % 2 === 0 ? 'bg-white dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'}`;
                    }
                  }

                  const colWidth = getColumnWidth(col);

                  const style: React.CSSProperties = {
                    width: colWidth,
                    minWidth: colWidth
                  };

                  if (isLeftFixed) style.left = leftOffset;
                  if (isRightFixed) style.right = rightOffset;

                  return (
                    <td key={colIndex} className={className} style={style}>
                      {!isEmpty ? renderCell(col, record, actualRowIndex) : ''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`bg-transparent rounded-lg flex flex-col gap-1 relative ${className}`}>
      {/* Header Table - Fixed */}
      {showHeader && fixedHeader && (
        <div className="relative">
          {renderHeaderTable()}
          {/* Shadow overlay không chiếm space */}
          <div className="absolute bottom-0 left-0 right-2 h-[2px] shadow-xxs z-10" />
        </div>
      )}

      {/* Body Table - Scrollable */}
      {renderBodyTable()}

      {/* Pagination */}
      {pagination && paginationType == 'loadmore' && (
        <Pagination className="absolute -translate-x-1/2 bottom-5 left-1/2" type={'loadmore'} {...pagination} />
      )}

      {pagination && paginationType == 'pagination' && <Pagination className="" type={'pagination'} {...pagination} />}
    </div>
  );
}
