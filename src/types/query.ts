export interface QueryParam {
  page: number;
  limit: number;
  search?: string;
  queryObject?: string;
  [key: string]: any;
}

export type QueryObject = SortType | SingleFiler | MultiFiler;

type MultiFiler = {
  type: 'multi-filter';
  field: string;
  value: string[];
};

type SingleFiler = {
  type: 'single-filter';
  field: string;
  value: string;
};

type SortType = {
  type: 'sort';
  field: string;
  value: 'ASC' | 'DESC';
};
