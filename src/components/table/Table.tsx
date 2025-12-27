import React, { useRef, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Checkbox } from '../checkbox/Checkbox';
import { Pagination, PaginationProps } from '../pagination/Pagination';
import { ExpandMore } from '../icons';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isArrayWithLength } from '@/utils/array';
import { Loader } from '../loader';

// Context to provide selected rows for compound pattern
const TableSelectedContext = createContext<any[]>([]);

export function useTableSelectedRows<T>() {
  return useContext(TableSelectedContext) as T[];
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: React.ReactNode;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  fixed?: 'left' | 'right';
  minWidth?: string | number;
  /**
   * If true, the column will be hidden from the table (default: false)
   */
  hidden?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  paginationType?: 'pagination' | 'loadmore';
  pagination?: PaginationProps;
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  rowDisabled?: (record: T, index: number) => boolean;
  rowLoading?: number[];
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  fixedHeader?: boolean;
  scroll?: { x?: number | string; y?: number | string };
  rowClassName?: (record: T, index: number) => string;
  rowStyle?: (record: T, index: number) => React.CSSProperties;
  sortField?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  onSort?: (field: string | null, order: 'asc' | 'desc' | null) => void;
  showEmptyRows?: boolean;
  maxHeight?: string;
  bodyClassName?: string;
}

const ROW_HEIGHT = 48; // Height of each row in pixels

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
  sortField = null,
  sortOrder = null,
  onSort,
  showEmptyRows = false,
  maxHeight,
  bodyClassName,
  children,
  rowLoading,
  rowDisabled
}: TableProps<T> & { children?: React.ReactNode }) {
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [emptyRowsCount, setEmptyRowsCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base'
  };

  // Calculate number of empty rows needed to fill viewport
  useEffect(() => {
    if (!showEmptyRows || !bodyScrollRef.current) return;

    const calculateEmptyRows = () => {
      const container = bodyScrollRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight;
      const dataRowsCount = data.length;
      const dataRowsHeight = dataRowsCount * ROW_HEIGHT;

      // Calculate how many empty rows can fit in remaining space
      const remainingHeight = containerHeight - dataRowsHeight;
      const emptyRowsFit = Math.floor(remainingHeight / ROW_HEIGHT);

      // Only add empty rows if there's space and data doesn't overflow
      setEmptyRowsCount(emptyRowsFit > 0 ? emptyRowsFit : 0);
    };

    calculateEmptyRows();

    // Recalculate on window resize
    const resizeObserver = new ResizeObserver(calculateEmptyRows);
    if (bodyScrollRef.current) {
      resizeObserver.observe(bodyScrollRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [data.length, showEmptyRows]);

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
    const allKeys = data.map((_, index) => {
      const pageIndex = pagination ? (pagination.current - 1) * pagination.pageSize + index : index;
      return pageIndex;
    });
    rowSelection.onChange(checked ? allKeys : [], checked ? data : []);
  };

  const handleSelectRow = (key: string | number, record: T, checked: boolean) => {
    if (!rowSelection) return;
    const newSelectedKeys = checked ? [...rowSelection.selectedRowKeys, key] : rowSelection.selectedRowKeys.filter((k) => k !== key);

    if (checked) {
      const newSelectedRows = [...selectedRows, record];
      setSelectedRows(newSelectedRows);
      rowSelection.onChange(newSelectedKeys, newSelectedRows);
    } else {
      const newSelectedRows = selectedRows.filter((r) => r.id !== record.id);
      setSelectedRows(newSelectedRows);
      rowSelection.onChange(newSelectedKeys, newSelectedRows);
    }
  };

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

  const getColumnWidth = (column: TableColumn<T>) => {
    if (column.width) {
      return typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    if (column.minWidth) {
      return typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
    }
    return 'auto';
  };

  // Only show columns that are not hidden
  const visibleColumns = columns.filter((col) => !col.hidden);
  const leftFixedColumns = visibleColumns.filter((col) => col.fixed === 'left');
  const rightFixedColumns = visibleColumns.filter((col) => col.fixed === 'right');

  const getLeftOffset = (columnIndex: number) => {
    const column = visibleColumns[columnIndex];
    if (column.fixed !== 'left') return 0;

    let offset = rowSelection ? 48 : 0;
    for (let i = 0; i < columnIndex; i++) {
      if (visibleColumns[i].fixed === 'left') {
        const width = getColumnWidth(visibleColumns[i]);
        offset += parseInt(width.replace('px', ''));
      }
    }
    return offset;
  };

  const getRightOffset = (columnIndex: number) => {
    const column = visibleColumns[columnIndex];
    if (column.fixed !== 'right') return 0;

    let offset = 0;
    for (let i = columnIndex + 1; i < visibleColumns.length; i++) {
      if (visibleColumns[i].fixed === 'right') {
        const width = getColumnWidth(visibleColumns[i]);
        offset += parseInt(width.replace('px', ''));
      }
    }
    return offset;
  };

  const getTotalWidth = () => {
    let totalWidth = rowSelection ? 48 : 0;
    visibleColumns.forEach((col) => {
      const width = getColumnWidth(col);
      totalWidth += parseInt(width.replace('px', ''));
    });
    return totalWidth;
  };

  const totalTableWidth = getTotalWidth();
  const scrollX = scroll?.x;
  const tableMinWidth = scrollX ? (typeof scrollX === 'number' ? `${scrollX}px` : scrollX) : `${totalTableWidth}px`;

  const renderHeaderTable = () => (
    <div
      ref={headerScrollRef}
      className={clsx(
        'overflow-scroll [scrollbar-gutter:stable] relative bg-bg-canvas border-border-element dark:border-border-element-dark border-b-2 border-t-2 dark:bg-bg-canvas-dark'
      )}
      style={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        scrollbarGutter: 'stable'
      }}
    >
      <table
        className={`shadow-xs ${sizeClasses[size]} ${bordered ? 'border-l-2 border-r-2 border-border-element dark:border-border-element-dark' : ''}`}
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
              <th className="w-12 h-8 py-1 text-left sticky left-0 z-30 bg-bg-canvas dark:bg-bg-canvas-dark">
                <div className="flex items-center justify-center px-4 gap-1 border-r-[1.25px] border-border-element dark:border-border-element-dark h-full">
                  <Checkbox indeterminate={isIndeterminate} checked={!!isAllSelected} onChange={(checked) => handleSelectAll(checked)} />
                </div>
              </th>
            )}

            {visibleColumns.map((col, colIndex) => {
              const leftOffset = getLeftOffset(colIndex);
              const rightOffset = getRightOffset(colIndex);
              const isLeftFixed = col.fixed === 'left';
              const isRightFixed = col.fixed === 'right';
              const isLastCol = colIndex === visibleColumns.length - 1;
              const isSorted = sortField === col.key;

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

              let thClassName = `h-9 py-1 ${alignClass} text-sm font-medium text-text-lo dark:text-text-lo-dark ${col.sortable ? 'cursor-pointer !text-text-hi dark:!text-text-hi-dark' : ''} bg-bg-canvas dark:bg-bg-canvas-dark`;

              const className = `h-8 ${alignClass} text-sm font-medium text-text-lo dark:text-text-lo-dark ${col.sortable ? 'cursor-pointer hover:!text-text-hi dark:hover:!text-text-hi-dark' : ''} bg-bg-canvas dark:bg-bg-canvas-dark`;

              if (isSorted) {
                thClassName += ' font-medium';
              } else {
                thClassName += ' font-normal';
              }

              if (isLeftFixed) {
                thClassName += ' sticky z-30 bg-white';
                const isLastLeftFixed = leftFixedColumns[leftFixedColumns.length - 1] === col;
                if (isLastLeftFixed) {
                  thClassName += ' fixed-left-shadow border-r border-border-element dark:border-border-element-dark';
                }
              } else if (isRightFixed) {
                thClassName += ' sticky z-30';
                const isFirstRightFixed = rightFixedColumns[0] === col;
                if (isFirstRightFixed) {
                  thClassName += ' fixed-right-shadow border-l border-border-element dark:border-border-element-dark';
                }
              }

              const colWidth = getColumnWidth(col);

              const style: React.CSSProperties = {
                width: colWidth,
                minWidth: colWidth
              };

              if (isLeftFixed) style.left = leftOffset;
              if (isRightFixed) style.right = rightOffset;

              let borderClassName = '';
              const isSecondLastCol = colIndex === visibleColumns.length - 2;
              const isLastColSticky = visibleColumns[visibleColumns.length - 1]?.fixed === 'right';

              if (!isLastCol && !isSecondLastCol && !isLeftFixed && !isRightFixed) {
                borderClassName += 'border-r-[1.25px] border-border-element dark:border-border-element-dark ';
              }
              // Using for case last column does not sticky, it should add right border to second last column
              if ((!isLastColSticky && isSecondLastCol) || isLeftFixed) {
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

  const getRowLoadingState = useCallback(
    (index: number) => {
      if (isArrayWithLength(rowLoading)) {
        return rowLoading.includes(index);
      }
    },
    [rowLoading]
  );

  const renderBodyTable = () => (
    <div
      ref={bodyScrollRef}
      // margin-right for the scroll bar space
      className="[scrollbar-gutter:stable] relative flex-1 dark:bg-bg-canvas-dark z-50 overflow-x-scroll"
      style={{
        maxHeight: maxHeight || '',
        overflowX: 'auto',
        overflowY: scroll?.y ? 'scroll' : 'visible'
      }}
      onScroll={handleBodyScroll}
    >
      <table
        className={`dark:bg-bg-canvas-dark ${sizeClasses[size]} ${bordered ? 'border-l-2 border-r-2 border-border-element dark:border-border-element-dark' : ''}`}
        style={{
          tableLayout: 'fixed',
          minWidth: tableMinWidth,
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0px'
        }}
      >
        <tbody className={bodyClassName}>
          {/* Render actual data rows */}
          {data.map((record, rowIndex) => {
            const actualRowIndex = showEmptyRows && pagination ? (pagination.current - 1) * pagination.pageSize + rowIndex : rowIndex;

            const isSelected = rowSelection?.selectedRowKeys.includes(actualRowIndex);
            const rowClass = `${actualRowIndex % 2 === 0 ? 'bg-bg-canvas dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'} ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${rowClassName?.(record, actualRowIndex) || ''}`;
            const rowStyleFinal: React.CSSProperties = {
              height: `${ROW_HEIGHT}px`,
              ...rowStyle?.(record, rowIndex)
            };

            const isRowDisabled = rowDisabled ? rowDisabled(record, actualRowIndex) : false;
            const isRowLoading = getRowLoadingState(rowIndex + 1);

            return (
              <tr
                key={actualRowIndex}
                className={twMerge(
                  clsx(rowClass, 'relative', {
                    'row-disabled': isRowDisabled,
                    'row-loading': isRowLoading
                  })
                )}
                style={rowStyleFinal}
                onClick={() => onRowClick?.(record, actualRowIndex)}
              >
                {rowSelection && (
                  <td className={`rounded-l-lg w-12 px-2 py-1 sticky left-0 z-10 ${rowClass}`} style={rowStyleFinal}>
                    <Checkbox checked={!!isSelected} onChange={(checked) => handleSelectRow(actualRowIndex, record, checked)} />
                  </td>
                )}

                {visibleColumns.map((col, colIndex) => {
                  const leftOffset = getLeftOffset(colIndex);
                  const rightOffset = getRightOffset(colIndex);
                  const isLeftFixed = col.fixed === 'left';
                  const isRightFixed = col.fixed === 'right';
                  const isSorted = sortField === col.key;
                  const isFirstCell = colIndex === 0 && !rowSelection;
                  const isLastCell = colIndex === visibleColumns.length - 1;

                  let className = `${rowClass} text-sm px-2 py-2 h-12 text-text-hi dark:text-text-hi-dark text-${col.align || 'left'} ${bordered ? 'border-r border-border-element dark:border-border-element-dark' : ''}`;

                  if (isSorted) className += ' font-medium';
                  if (isFirstCell) className += ' rounded-l-lg';
                  if (isLastCell) className += ' rounded-r-lg';

                  if (isLeftFixed) {
                    className += ' sticky z-10';
                    const isLastLeftFixed = leftFixedColumns[leftFixedColumns.length - 1] === col;
                    if (isLastLeftFixed) {
                      className += ` fixed-left-shadow border-r border-border-element dark:border-border-element-dark ${actualRowIndex % 2 === 0 ? 'dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'}`;
                    }
                  }
                  if (isRightFixed) {
                    className += ' sticky z-10';
                    const isFirstRightFixed = rightFixedColumns[0] === col;
                    if (isFirstRightFixed) {
                      className += ` h-full fixed-right-shadow border-l border-border-element dark:border-border-element-dark ${actualRowIndex % 2 === 0 ? 'bg-white dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'}`;
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
                      {renderCell(col, record, actualRowIndex)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Render empty rows to fill viewport - macOS Finder style */}
          {showEmptyRows &&
            emptyRowsCount > 0 &&
            Array.from({ length: emptyRowsCount }).map((_, idx) => {
              const emptyRowIndex = data.length + idx;
              const rowClass = `${emptyRowIndex % 2 === 0 ? 'bg-bg-canvas dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-bg-mute-dark'}`;

              return (
                <tr key={`empty-${idx}`} className={rowClass} style={{ height: `${ROW_HEIGHT}px` }}>
                  {rowSelection && <td className={`rounded-l-lg w-12 px-2 py-1 sticky left-0 z-10 ${rowClass}`} />}
                  {visibleColumns.map((col, colIndex) => {
                    const leftOffset = getLeftOffset(colIndex);
                    const rightOffset = getRightOffset(colIndex);
                    const isLeftFixed = col.fixed === 'left';
                    const isRightFixed = col.fixed === 'right';
                    const isFirstCell = colIndex === 0 && !rowSelection;
                    const isLastCell = colIndex === visibleColumns.length - 1;

                    let className = `${rowClass} text-sm px-2 py-2 h-12 text-text-hi dark:text-text-hi-dark text-${col.align || 'left'} ${bordered ? 'border-r border-border-element dark:border-border-element-dark' : ''}`;

                    if (isFirstCell) className += ' rounded-l-lg';
                    if (isLastCell) className += ' rounded-r-lg';

                    if (isLeftFixed) {
                      className += ' sticky z-10';
                      const isLastLeftFixed = leftFixedColumns[leftFixedColumns.length - 1] === col;
                      if (isLastLeftFixed) {
                        className += ` fixed-left-shadow ${emptyRowIndex % 2 === 0 ? 'dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-mute-dark'}`;
                      }
                    }
                    if (isRightFixed) {
                      className += ' sticky z-10';
                      const isFirstRightFixed = rightFixedColumns[0] === col;
                      if (isFirstRightFixed) {
                        className += ` h-full fixed-right-shadow border-l border-border-element dark:border-border-element-dark ${emptyRowIndex % 2 === 0 ? 'bg-white dark:bg-bg-canvas-dark' : 'bg-bg-mute dark:bg-mute-dark'}`;
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
                        {/* Empty cell */}
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
    <TableSelectedContext.Provider value={selectedRows}>
      <Loader isLoading={loading} className={`bg-transparent rounded-lg flex flex-col gap-1 relative ${className}`}>
        {children}
        {showHeader && fixedHeader && (
          <div className="relative">
            {renderHeaderTable()}
            <div className="absolute bottom-0 left-0 right-2 h-[2px] shadow-xxs z-10" />
          </div>
        )}
        {renderBodyTable()}

        {pagination && paginationType === 'loadmore' && (
          <Pagination
            className="absolute -translate-x-1/2 bottom-5 left-1/2"
            type={'loadmore'}
            {...pagination}
            onChange={(page, pageSize) => {
              setSelectedRows([]);
              pagination.onChange?.(page, pageSize);
              rowSelection?.onChange?.([], []);
            }}
          />
        )}
        {pagination && paginationType === 'pagination' && (
          <Pagination
            className=""
            type={'pagination'}
            {...pagination}
            onChange={(page, pageSize) => {
              setSelectedRows([]);
              pagination.onChange?.(page, pageSize);
              rowSelection?.onChange?.([], []);
            }}
          />
        )}
      </Loader>
    </TableSelectedContext.Provider>
  );
}

function BulkActions<T>({ children }: { children: (selectedRows: T[]) => React.ReactNode }) {
  const selectedRows = useTableSelectedRows<T>();
  return <>{children(selectedRows)}</>;
}

Table.BulkActions = BulkActions;
