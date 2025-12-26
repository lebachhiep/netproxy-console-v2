export function isNilOrEmpty(value: any): boolean {
  // null or undefined
  if (value === null || value === undefined) return true;

  // string or array
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  // plain object (NOT array-like)
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}
