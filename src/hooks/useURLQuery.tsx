import { useState, useCallback } from 'react';

function getQueryFromURL<T>(): T {
  const params = new URLSearchParams(window.location.search);
  const obj = {} as any;
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj as T;
}

function setQueryToURL<T>(query: T, preventReload?: boolean) {
  const params = new URLSearchParams();
  Object.entries(query as Record<string, any>).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  if (preventReload) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.location.search = params.toString();
  }
}

export function useURLQuery<T extends Record<string, any>>(initialValue: T) {
  const [urlQuery, setUrlQueryState] = useState<T>(() => {
    const query = getQueryFromURL<T>();
    return Object.keys(query).length ? query : initialValue;
  });

  const setURLQuery = useCallback((query: T, options?: { preventReload?: boolean }) => {
    setUrlQueryState(query);
    setQueryToURL(query, options?.preventReload);
  }, []);

  return [urlQuery, setURLQuery] as const;
}
