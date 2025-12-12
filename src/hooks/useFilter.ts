import { useMemo } from 'react';

export interface FilterItem {
  title: string;
  format: 'search' | 'checkbox' | 'range' | 'select' | 'dateRange' | 'page';
  field: string[];
  data: any;
}

export interface FilterResult {
  url: string;
  filteredData: any[];
  params: Record<string, any>;
}

/**
 * Parse URL query parameters into FilterItem array
 * @param url - URL with query params
 * @param filterConfig - Configuration mapping for filter titles and formats
 * @returns Array of FilterItem objects
 */
export const parseFilterFromURL = (url: string, filterConfig: Record<string, { format: string; field: string[] }>): FilterItem[] => {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;
  const filterItems: FilterItem[] = [];

  Object.entries(filterConfig).forEach(([title, config]) => {
    const { format, field } = config;

    const searchValue = params.get(title);
    const fromValue = params.get(`${title}_from`);
    const toValue = params.get(`${title}_to`);
    const checkboxValues = params.getAll(title);
    const minValue = params.get(`${title}_min`);
    const maxValue = params.get(`${title}_max`);
    const pageValue = params.get('page');
    const limitValue = params.get('limit');

    switch (format) {
      case 'search':
        if (searchValue) {
          filterItems.push({ title, format: 'search', field, data: searchValue });
        }
        break;

      case 'select':
        if (searchValue) {
          filterItems.push({ title, format: 'select', field, data: searchValue });
        }
        break;

      case 'dateRange':
        if (fromValue && toValue) {
          filterItems.push({ title, format: 'dateRange', field, data: [fromValue, toValue] });
        }
        break;

      case 'checkbox':
        if (checkboxValues.length > 0) {
          filterItems.push({ title, format: 'checkbox', field, data: checkboxValues });
        }
        break;

      case 'range':
        if (minValue || maxValue) {
          filterItems.push({
            title,
            format: 'range',
            field,
            data: [minValue ? Number(minValue) : 0, maxValue ? Number(maxValue) : Infinity]
          });
        }
        break;

      case 'page':
        if (pageValue && limitValue) {
          filterItems.push({
            title,
            format: 'page',
            field,
            data: [Number(pageValue), Number(limitValue)]
          });
        }
        break;
    }
  });

  return filterItems;
};

const useFilter = (url: string, items: FilterItem[], sourceData: any[]): FilterResult => {
  const result = useMemo(() => {
    let filteredData = [...sourceData];
    const params = new URLSearchParams();
    const paramsObj: Record<string, any> = {};

    items.forEach((item) => {
      const { title, format, data } = item;

      if (data === null || data === undefined || data === '' || (Array.isArray(data) && data.length === 0)) {
        return;
      }

      switch (format) {
        case 'search':
          if (typeof data === 'string' && data.trim()) {
            const searchLower = data.toLowerCase().trim();
            filteredData = filteredData.filter((product: any) =>
              item.field.some((key) => {
                const value = product[key];
                return typeof value === 'string' && value.toLowerCase().includes(searchLower);
              })
            );
            params.append('search', data.trim());
            paramsObj.search = data.trim();
          }
          break;

        case 'checkbox':
          if (Array.isArray(data) && data.length > 0 && Array.isArray(item.field) && item.field.length > 0) {
            filteredData = filteredData.filter((product: any) => {
              return item.field.some((fieldKey: string) => {
                const fieldValue = product[fieldKey];
                if (fieldValue === null || fieldValue === undefined) return false;

                return data.includes(fieldValue);
              });
            });
            data.forEach((val: any) => {
              params.append(title, String(val));
            });
            paramsObj[title] = data;
          }
          break;

        case 'select':
          if (data != null && item.field.length > 0) {
            filteredData = filteredData.filter((product: any) => {
              return item.field.some((fieldKey: string) => {
                const fieldValue = product[fieldKey];
                return fieldValue === data;
              });
            });

            params.append(title, String(data));
            paramsObj[title] = data;
          }
          break;

        case 'range':
          if (Array.isArray(data) && data.length === 2) {
            const [min, max] = data.map(Number);

            if (isNaN(min) && isNaN(max)) break;

            filteredData = filteredData.filter((product: any) => {
              return item.field.some((fieldKey: string) => {
                const value = product[fieldKey];
                if (value == null) return false;
                const numValue = Number(value);
                if (isNaN(numValue)) return false;
                return numValue >= min && numValue <= max;
              });
            });

            if (!isNaN(min)) {
              params.append(`${title}_min`, String(min));
              paramsObj[`${title}_min`] = min;
            }
            if (!isNaN(max) && max !== Infinity) {
              params.append(`${title}_max`, String(max));
              paramsObj[`${title}_max`] = max;
            }
          }
          break;

        case 'dateRange':
          if (Array.isArray(data) && data.length === 2 && data[0] && data[1]) {
            const [startStr, endStr] = data;
            const start = new Date(startStr);
            const end = new Date(endStr);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) break;

            end.setHours(23, 59, 59, 999);

            filteredData = filteredData.filter((product: any) => {
              return item.field.some((fieldKey: string) => {
                const rawDate = product[fieldKey];
                if (!rawDate) return false;

                const date = new Date(rawDate);
                if (isNaN(date.getTime())) return false;

                return date >= start && date <= end;
              });
            });

            params.append(`${title}_from`, startStr);
            params.append(`${title}_to`, endStr);
            paramsObj[`${title}_from`] = startStr;
            paramsObj[`${title}_to`] = endStr;
          }
          break;

        case 'page':
          if (Array.isArray(data) && data.length === 2) {
            const [pageNum, pageSize] = data.map(Number);

            if (isNaN(pageNum) || isNaN(pageSize) || pageNum < 1 || pageSize < 1) {
              break;
            }

            const page = pageNum;
            const limit = pageSize;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            filteredData = filteredData.slice(startIndex, endIndex);

            params.append('page', String(page));
            params.append('limit', String(limit));
            paramsObj.page = page;
            paramsObj.limit = limit;
          }
          break;

        default:
          if (data != null) {
            params.append(title, String(data));
            paramsObj[title] = data;
          }
      }
    });

    const baseUrl = url.split('?')[0];
    const queryString = params.toString();
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    return {
      url: finalUrl,
      filteredData,
      params: paramsObj
    };
  }, [url, items, sourceData]);

  return result;
};

export default useFilter;
