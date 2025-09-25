import React from 'react';
import { TableColumn } from './Table';
import { Checkbox } from '../checkbox/Checkbox';

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
  };
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  onSort: (columnKey: string) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
  bordered: boolean;
  showHeader: boolean;
  getColumnWidth: (col: TableColumn<T>) => string;
  getLeftOffset: (colIndex: number) => number;
  getRightOffset: (colIndex: number) => number;
  leftFixedColumns: TableColumn<T>[];
  rightFixedColumns: TableColumn<T>[];
  fixedHeader?: boolean;
}

export function TableHeader<T>({
  columns,
  rowSelection,
  sortField,
  sortOrder,
  onSort,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  bordered,
  showHeader,
  getColumnWidth,
  getLeftOffset,
  getRightOffset,
  leftFixedColumns,
  rightFixedColumns,
  fixedHeader = false
}: TableHeaderProps<T>) {
  if (!showHeader) return null;

  return (
    <thead className={`bg-gray-50 z-20 ${fixedHeader ? 'sticky top-0' : ''} `}>
      <tr>
        {rowSelection && (
          <th
            className="w-12 px-3 py-3 text-left sticky left-0 z-30 bg-gray-50 border-r border-gray-200"
            style={{
              boxShadow: leftFixedColumns.length > 0 ? '2px 0 5px -2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Checkbox indeterminate={isIndeterminate} checked={!!isAllSelected} onChange={(checked) => onSelectAll(checked)} />
          </th>
        )}

        {columns.map((col, colIndex) => {
          const leftOffset = getLeftOffset(colIndex);
          const rightOffset = getRightOffset(colIndex);
          const isLeftFixed = col.fixed === 'left';
          const isRightFixed = col.fixed === 'right';

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

          let className = `px-6 py-3 ${alignClass} text-xs font-medium text-gray-500 uppercase ${
            col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
          } ${bordered ? 'border-r border-gray-200' : ''}`;

          if (isLeftFixed) {
            className += ' sticky z-30 bg-gray-50';
            const isLastLeftFixed = leftFixedColumns[leftFixedColumns.length - 1] === col;
            if (isLastLeftFixed) {
              className += ' shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]';
            }
          } else if (isRightFixed) {
            className += ' sticky z-30 bg-gray-50';
            const isFirstRightFixed = rightFixedColumns[0] === col;
            if (isFirstRightFixed) {
              className += ' shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]';
            }
          }

          const style: React.CSSProperties = {
            width: getColumnWidth(col),
            minWidth: getColumnWidth(col)
          };

          if (isLeftFixed) style.left = leftOffset;
          if (isRightFixed) style.right = rightOffset;

          return (
            <th key={colIndex} className={className} style={style} onClick={() => col.sortable && onSort(col.key as string)}>
              <div className={`flex items-center gap-1 ${justifyClass}`}>
                <span>{col.title}</span>
                {col.sortable && (
                  <div className="flex flex-col">
                    <svg
                      className={`w-3 h-3 ${sortField === col.key && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 
                          3.293a1 1 0 01-1.414-1.414l4-4a1 1 
                          0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className={`w-3 h-3 -mt-1 ${sortField === col.key && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 
                          10.586l3.293-3.293a1 1 
                          0 111.414 1.414l-4 4a1 1 
                          0 01-1.414 0l-4-4a1 1 
                          0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
